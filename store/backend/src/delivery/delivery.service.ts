import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeliveryService {
  constructor(private prisma: PrismaService) {}

  // Delivery Person Profile management
  async findAllDeliveryPersons() {
    return this.prisma.deliveryPersonProfile.findMany({
      where: { isActive: true },
      include: {
        user: true,
        zone: true,
        city: true,
        region: true,
      },
    });
  }

  async findAvailableDeliveryPersons(zoneId?: number, cityId?: number) {
    const where: any = {
      isActive: true,
      isAvailable: true,
      isVerified: true,
    };

    if (zoneId) {
      where.zoneId = zoneId;
    }
    if (cityId) {
      where.cityId = cityId;
    }

    return this.prisma.deliveryPersonProfile.findMany({
      where,
      include: {
        user: true,
        zone: true,
        city: true,
        region: true,
      },
      orderBy: {
        rating: 'desc',
      },
    });
  }

  async findDeliveryPersonById(userId: number) {
    return this.prisma.deliveryPersonProfile.findUnique({
      where: { userId },
      include: {
        user: true,
        zone: true,
        city: true,
        region: true,
        deliveries: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  async createDeliveryPersonProfile(data: {
    userId: number;
    vehicleType: string;
    vehiclePlateNumber?: string;
    licenseNumber?: string;
    idNumber?: string;
    zoneId?: number;
    cityId?: number;
    regionId?: number;
  }) {
    return this.prisma.deliveryPersonProfile.create({
      data: {
        userId: data.userId,
        vehicleType: data.vehicleType,
        vehiclePlateNumber: data.vehiclePlateNumber,
        licenseNumber: data.licenseNumber,
        idNumber: data.idNumber,
        zoneId: data.zoneId,
        cityId: data.cityId,
        regionId: data.regionId,
        isAvailable: true,
        isVerified: false,
        completedDeliveries: 0,
        isActive: true,
      },
    });
  }

  async updateDeliveryPersonProfile(
    userId: number,
    data: {
      vehicleType?: string;
      vehiclePlateNumber?: string;
      licenseNumber?: string;
      idNumber?: string;
      zoneId?: number;
      cityId?: number;
      regionId?: number;
      isAvailable?: boolean;
      isVerified?: boolean;
      rating?: number;
    },
  ) {
    return this.prisma.deliveryPersonProfile.update({
      where: { userId },
      data,
    });
  }

  async toggleDeliveryPersonAvailability(userId: number) {
    const profile = await this.prisma.deliveryPersonProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new Error('Delivery person profile not found');
    }

    return this.prisma.deliveryPersonProfile.update({
      where: { userId },
      data: {
        isAvailable: !profile.isAvailable,
      },
    });
  }

  // Delivery management
  async findAllDeliveries() {
    return this.prisma.delivery.findMany({
      include: {
        deliveryPerson: {
          include: {
            user: true,
          },
        },
        order: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findDeliveriesByPersonId(deliveryPersonId: number) {
    return this.prisma.delivery.findMany({
      where: { deliveryPersonId },
      include: {
        order: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findDeliveryById(id: number) {
    return this.prisma.delivery.findUnique({
      where: { id },
      include: {
        deliveryPerson: {
          include: {
            user: true,
          },
        },
        order: true,
      },
    });
  }

  async createDelivery(data: {
    deliveryPersonId: number;
    orderId: number;
    pickupLocation?: any;
    dropoffLocation: any;
    recipientName: string;
    recipientPhone: string;
    deliveryNotes?: string;
    deliveryFee?: number;
    cashOnDelivery?: number;
  }) {
    return this.prisma.delivery.create({
      data: {
        deliveryPersonId: data.deliveryPersonId,
        orderId: data.orderId,
        status: 'ASSIGNED',
        pickupLocation: data.pickupLocation,
        dropoffLocation: data.dropoffLocation,
        recipientName: data.recipientName,
        recipientPhone: data.recipientPhone,
        deliveryNotes: data.deliveryNotes,
        deliveryFee: data.deliveryFee || 0,
        cashOnDelivery: data.cashOnDelivery || 0,
      },
    });
  }

  async updateDeliveryStatus(
    id: number,
    status: string,
    data?: {
      currentLocation?: any;
      pickedUpAt?: Date;
      actualDeliveryTime?: Date;
    },
  ) {
    const updateData: any = { status };

    if (data?.currentLocation) {
      updateData.currentLocation = data.currentLocation;
    }

    if (status === 'PICKED_UP' && !data?.pickedUpAt) {
      updateData.pickedUpAt = new Date();
    } else if (data?.pickedUpAt) {
      updateData.pickedUpAt = data.pickedUpAt;
    }

    if (status === 'DELIVERED' && !data?.actualDeliveryTime) {
      updateData.actualDeliveryTime = new Date();
    } else if (data?.actualDeliveryTime) {
      updateData.actualDeliveryTime = data.actualDeliveryTime;
    }

    // Update delivery person's completed deliveries count if delivered
    if (status === 'DELIVERED') {
      const delivery = await this.prisma.delivery.findUnique({
        where: { id },
      });

      if (delivery) {
        await this.prisma.deliveryPersonProfile.update({
          where: { userId: delivery.deliveryPersonId },
          data: {
            completedDeliveries: {
              increment: 1,
            },
          },
        });
      }
    }

    return this.prisma.delivery.update({
      where: { id },
      data: updateData,
    });
  }

  async rateDelivery(id: number, rating: number, feedback?: string) {
    const delivery = await this.prisma.delivery.update({
      where: { id },
      data: {
        rating,
        feedback,
      },
    });

    // Update delivery person's average rating
    const deliveryPersonRatings = await this.prisma.delivery.findMany({
      where: {
        deliveryPersonId: delivery.deliveryPersonId,
        rating: { not: null },
      },
      select: { rating: true },
    });

    if (deliveryPersonRatings.length > 0) {
      const averageRating =
        deliveryPersonRatings.reduce((sum, d) => sum + (d.rating || 0), 0) /
        deliveryPersonRatings.length;

      await this.prisma.deliveryPersonProfile.update({
        where: { userId: delivery.deliveryPersonId },
        data: {
          rating: Math.round(averageRating * 100) / 100, // Round to 2 decimal places
        },
      });
    }

    return delivery;
  }
}
