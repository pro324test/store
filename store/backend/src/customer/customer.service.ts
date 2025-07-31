import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  // Customer Profile
  async findCustomerProfile(userId: number) {
    return this.prisma.customerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
          },
        },
        addresses: {
          include: {
            city: true,
            region: true,
          },
          orderBy: { isDefault: 'desc' },
        },
        defaultAddress: {
          include: {
            city: true,
            region: true,
          },
        },
        wishlist: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                nameEn: true,
                slug: true,
                price: true,
                images: {
                  where: { isDefault: true },
                  take: 1,
                },
              },
            },
          },
          orderBy: { addedAt: 'desc' },
        },
      },
    });
  }

  async createCustomerProfile(userId: number, language = 'ar') {
    return this.prisma.customerProfile.create({
      data: {
        userId,
        language,
        isActive: true,
      },
    });
  }

  async updateCustomerProfile(
    userId: number,
    data: {
      language?: string;
      defaultAddressId?: number;
    },
  ) {
    return this.prisma.customerProfile.update({
      where: { userId },
      data,
    });
  }

  // Customer Addresses
  async findCustomerAddresses(customerId: number) {
    return this.prisma.customerAddress.findMany({
      where: { customerId },
      include: {
        city: true,
        region: true,
      },
      orderBy: { isDefault: 'desc' },
    });
  }

  async findAddressById(id: number) {
    return this.prisma.customerAddress.findUnique({
      where: { id },
      include: {
        city: true,
        region: true,
      },
    });
  }

  async createAddress(data: {
    customerId: number;
    name: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    cityId?: number;
    regionId?: number;
    postalCode?: string;
    notes?: string;
    isDefault?: boolean;
  }) {
    // If this is set as default, unset other defaults
    if (data.isDefault) {
      await this.prisma.customerAddress.updateMany({
        where: {
          customerId: data.customerId,
          isDefault: true,
        },
        data: { isDefault: false },
      });
    }

    const address = await this.prisma.customerAddress.create({
      data: {
        customerId: data.customerId,
        name: data.name,
        phoneNumber: data.phoneNumber,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        cityId: data.cityId,
        regionId: data.regionId,
        postalCode: data.postalCode,
        notes: data.notes,
        isDefault: data.isDefault || false,
      },
    });

    // Update customer profile's default address if this is default
    if (data.isDefault) {
      await this.prisma.customerProfile.update({
        where: { userId: data.customerId },
        data: { defaultAddressId: address.id },
      });
    }

    return address;
  }

  async updateAddress(
    id: number,
    data: {
      name?: string;
      phoneNumber?: string;
      addressLine1?: string;
      addressLine2?: string;
      cityId?: number;
      regionId?: number;
      postalCode?: string;
      notes?: string;
      isDefault?: boolean;
    },
  ) {
    const address = await this.prisma.customerAddress.findUnique({
      where: { id },
    });

    if (!address) {
      throw new Error('Address not found');
    }

    // If this is being set as default, unset other defaults
    if (data.isDefault) {
      await this.prisma.customerAddress.updateMany({
        where: {
          customerId: address.customerId,
          isDefault: true,
        },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await this.prisma.customerAddress.update({
      where: { id },
      data,
    });

    // Update customer profile's default address if this is default
    if (data.isDefault) {
      await this.prisma.customerProfile.update({
        where: { userId: address.customerId },
        data: { defaultAddressId: id },
      });
    }

    return updatedAddress;
  }

  async deleteAddress(id: number) {
    const address = await this.prisma.customerAddress.findUnique({
      where: { id },
    });

    if (!address) {
      throw new Error('Address not found');
    }

    // If this was the default address, clear the default
    if (address.isDefault) {
      await this.prisma.customerProfile.update({
        where: { userId: address.customerId },
        data: { defaultAddressId: null },
      });
    }

    return this.prisma.customerAddress.delete({
      where: { id },
    });
  }

  // Wishlist
  async getCustomerWishlist(customerId: number) {
    return this.prisma.wishlistItem.findMany({
      where: { customerId },
      include: {
        product: {
          include: {
            images: {
              where: { isDefault: true },
              take: 1,
            },
            vendor: {
              select: {
                storeName: true,
                storeNameEn: true,
              },
            },
          },
        },
      },
      orderBy: { addedAt: 'desc' },
    });
  }

  async addToWishlist(customerId: number, productId: number) {
    return this.prisma.wishlistItem.create({
      data: {
        customerId,
        productId,
      },
    });
  }

  async removeFromWishlist(customerId: number, productId: number) {
    return this.prisma.wishlistItem.deleteMany({
      where: {
        customerId,
        productId,
      },
    });
  }

  async isProductInWishlist(
    customerId: number,
    productId: number,
  ): Promise<boolean> {
    const item = await this.prisma.wishlistItem.findFirst({
      where: {
        customerId,
        productId,
      },
    });
    return !!item;
  }

  async clearWishlist(customerId: number) {
    return this.prisma.wishlistItem.deleteMany({
      where: { customerId },
    });
  }
}
