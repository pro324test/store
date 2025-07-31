import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, PaymentStatus } from './order.model';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async findAllOrders(limit = 50, offset = 0, status?: OrderStatus) {
    const where = status ? { status } : {};

    return this.prisma.order.findMany({
      where,
      include: {
        items: true,
        customer: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
        vendor: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async findOrderById(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                nameEn: true,
              },
            },
            variation: {
              select: {
                id: true,
                sku: true,
              },
            },
          },
        },
        customer: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
        vendor: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  async updatePaymentStatus(id: number, paymentStatus: PaymentStatus) {
    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        paymentStatus,
        paidAt: paymentStatus === PaymentStatus.PAID ? new Date() : null,
      },
      include: {
        items: true,
        customer: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
        vendor: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
      },
    });

    return updatedOrder;
  }

  async getOrderStats() {
    // Get order counts by status
    const orderCounts = await this.prisma.order.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    // Get revenue data
    const totalRevenue = await this.prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        paymentStatus: PaymentStatus.PAID,
      },
    });

    // Get today's revenue
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayRevenue = await this.prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        paymentStatus: PaymentStatus.PAID,
        paidAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    // Get this month's revenue
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const monthlyRevenue = await this.prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        paymentStatus: PaymentStatus.PAID,
        paidAt: {
          gte: monthStart,
        },
      },
    });

    // Get recent orders
    const recentOrders = await this.findAllOrders(10, 0);

    // Process order counts
    const statusCounts = {
      totalOrders: orderCounts.reduce((sum, item) => sum + item._count.id, 0),
      pendingOrders:
        orderCounts.find((item) => item.status === OrderStatus.PENDING)?._count
          .id || 0,
      processingOrders:
        orderCounts.find((item) => item.status === OrderStatus.PROCESSING)
          ?._count.id || 0,
      completedOrders:
        orderCounts.find((item) => item.status === OrderStatus.DELIVERED)
          ?._count.id || 0,
      cancelledOrders:
        orderCounts.find((item) => item.status === OrderStatus.CANCELLED)
          ?._count.id || 0,
    };

    return {
      summary: {
        ...statusCounts,
        totalRevenue: Number(totalRevenue._sum.total || 0),
        todayRevenue: Number(todayRevenue._sum.total || 0),
        monthlyRevenue: Number(monthlyRevenue._sum.total || 0),
      },
      recentOrders,
    };
  }

  async getOrdersByDateRange(startDate: Date, endDate: Date) {
    return this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        items: true,
        customer: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
        vendor: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async searchOrders(searchTerm: string, limit = 50, offset = 0) {
    return this.prisma.order.findMany({
      where: {
        OR: [
          {
            orderNumber: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            customer: {
              user: {
                fullName: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
            },
          },
          {
            customer: {
              user: {
                phoneNumber: {
                  contains: searchTerm,
                },
              },
            },
          },
          {
            vendor: {
              storeName: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          },
        ],
      },
      include: {
        items: true,
        customer: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
        vendor: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  // Order State Management
  async updateOrderStatus(
    orderId: number,
    status: OrderStatus,
    updatedBy?: number,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        ...(status === 'DELIVERED' && { deliveredAt: new Date() }),
        ...(status === 'CANCELLED' && { cancelledAt: new Date() }),
      },
    });

    // Log status change
    await this.prisma.orderStatusHistory.create({
      data: {
        orderId,
        status,
        createdById: updatedBy || 1, // Default to system user if not provided
        note: `Status updated to ${status}`,
      },
    });

    // If order is cancelled, restore inventory
    if (status === 'CANCELLED') {
      for (const item of order.items) {
        await this.prisma.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              increment: item.quantity,
            },
          },
        });
      }
    }

    return updatedOrder;
  }

  async assignDeliveryPerson(orderId: number, deliveryPersonId: number) {
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'SHIPPED', // Use valid enum value
        vendorNotes: `Assigned to delivery person ID: ${deliveryPersonId}`,
      },
    });

    // Log assignment
    await this.prisma.orderStatusHistory.create({
      data: {
        orderId,
        status: 'SHIPPED',
        createdById: deliveryPersonId,
        note: 'Assigned to delivery person',
      },
    });

    return order;
  }

  async getOrderStatusHistory(orderId: number) {
    return this.prisma.orderStatusHistory.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async calculateOrderMetrics(vendorId?: number) {
    const where = vendorId ? { vendorId } : {};

    const [totalOrders, totalRevenue, averageOrderValue] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.aggregate({
        where,
        _sum: { total: true },
      }),
      this.prisma.order.aggregate({
        where,
        _avg: { total: true },
      }),
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      averageOrderValue: averageOrderValue._avg.total || 0,
    };
  }
}
