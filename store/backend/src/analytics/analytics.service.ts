import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardMetrics() {
    // Get user counts
    const userCounts = await this.prisma.user.groupBy({
      by: ['isActive'],
      _count: {
        id: true,
      },
    });

    const totalUsers = userCounts.reduce(
      (sum, item) => sum + item._count.id,
      0,
    );
    const activeUsers =
      userCounts.find((item) => item.isActive)?._count.id || 0;

    // Get vendor counts
    const vendorCounts = await this.prisma.vendorProfile.groupBy({
      by: ['isActive'],
      _count: {
        userId: true,
      },
    });

    const totalVendors = vendorCounts.reduce(
      (sum, item) => sum + item._count.userId,
      0,
    );
    const activeVendors =
      vendorCounts.find((item) => item.isActive)?._count.userId || 0;

    // Get customer count
    const totalCustomers = await this.prisma.customerProfile.count();

    // Get product counts
    const productCounts = await this.prisma.product.groupBy({
      by: ['isActive', 'isFeatured'],
      _count: {
        id: true,
      },
    });

    const totalProducts = productCounts.reduce(
      (sum, item) => sum + item._count.id,
      0,
    );
    const activeProducts = productCounts
      .filter((item) => item.isActive)
      .reduce((sum, item) => sum + item._count.id, 0);
    const featuredProducts = productCounts
      .filter((item) => item.isActive && item.isFeatured)
      .reduce((sum, item) => sum + item._count.id, 0);

    // Get category counts
    const categoryCounts = await this.prisma.category.groupBy({
      by: ['isActive'],
      _count: {
        id: true,
      },
    });

    const totalCategories = categoryCounts.reduce(
      (sum, item) => sum + item._count.id,
      0,
    );
    const activeCategories =
      categoryCounts.find((item) => item.isActive)?._count.id || 0;

    // Get brand counts
    const brandCounts = await this.prisma.brand.groupBy({
      by: ['isActive'],
      _count: {
        id: true,
      },
    });

    const totalBrands = brandCounts.reduce(
      (sum, item) => sum + item._count.id,
      0,
    );
    const activeBrands =
      brandCounts.find((item) => item.isActive)?._count.id || 0;

    // Get order counts by status
    const orderCounts = await this.prisma.order.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    const totalOrders = orderCounts.reduce(
      (sum, item) => sum + item._count.id,
      0,
    );
    const pendingOrders =
      orderCounts.find((item) => item.status === 'PENDING')?._count.id || 0;
    const processingOrders =
      orderCounts.find((item) => item.status === 'PROCESSING')?._count.id || 0;
    const completedOrders =
      orderCounts.find((item) => item.status === 'DELIVERED')?._count.id || 0;
    const cancelledOrders =
      orderCounts.find((item) => item.status === 'CANCELLED')?._count.id || 0;

    // Get revenue data
    const totalRevenue = await this.prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        paymentStatus: 'PAID',
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
        paymentStatus: 'PAID',
        paidAt: {
          gte: monthStart,
        },
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
        paymentStatus: 'PAID',
        paidAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    return {
      totalUsers,
      activeUsers,
      totalVendors,
      activeVendors,
      totalCustomers,
      totalProducts,
      activeProducts,
      featuredProducts,
      totalCategories,
      activeCategories,
      totalBrands,
      activeBrands,
      totalOrders,
      pendingOrders,
      processingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue: Number(totalRevenue._sum.total || 0),
      monthlyRevenue: Number(monthlyRevenue._sum.total || 0),
      todayRevenue: Number(todayRevenue._sum.total || 0),
    };
  }

  async getSalesAnalytics() {
    // Get last 30 days of sales data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailySales = await this.prisma.order.groupBy({
      by: ['placedAt'],
      _sum: {
        total: true,
      },
      _count: {
        id: true,
      },
      where: {
        paymentStatus: 'PAID',
        placedAt: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        placedAt: 'asc',
      },
    });

    // Get last 12 months of sales data
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlySalesRaw = await this.prisma.order.findMany({
      where: {
        paymentStatus: 'PAID',
        placedAt: {
          gte: twelveMonthsAgo,
        },
      },
      select: {
        total: true,
        placedAt: true,
      },
    });

    // Group by month
    const monthlySalesMap = new Map();
    monthlySalesRaw.forEach((order) => {
      const monthKey = `${order.placedAt.getFullYear()}-${order.placedAt.getMonth() + 1}`;
      if (!monthlySalesMap.has(monthKey)) {
        monthlySalesMap.set(monthKey, 0);
      }
      monthlySalesMap.set(
        monthKey,
        monthlySalesMap.get(monthKey) + Number(order.total),
      );
    });

    const monthlySales = Array.from(monthlySalesMap.entries()).map(
      ([label, value]) => ({
        label,
        value,
      }),
    );

    // Get category breakdown
    const categoryBreakdown = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        subtotal: true,
      },
      _count: {
        id: true,
      },
    });

    // Get category sales by joining with products
    const categoryBreakdownData = await Promise.all(
      categoryBreakdown.slice(0, 10).map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          include: { category: true },
        });
        return {
          label: product?.category?.name || 'Unknown',
          value: Number(item._sum.subtotal || 0),
        };
      }),
    );

    // Get vendor performance
    const vendorPerformance = await this.prisma.order.groupBy({
      by: ['vendorId'],
      _sum: {
        total: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          total: 'desc',
        },
      },
      take: 10,
    });

    const vendorPerformanceData = await Promise.all(
      vendorPerformance.map(async (item) => {
        const vendor = await this.prisma.vendorProfile.findUnique({
          where: { userId: item.vendorId },
        });
        return {
          label: vendor?.storeName || 'Unknown Vendor',
          value: Number(item._sum.total || 0),
        };
      }),
    );

    return {
      dailySales: dailySales.map((item) => ({
        label: item.placedAt.toISOString().split('T')[0],
        value: Number(item._sum.total || 0),
        date: item.placedAt.toISOString().split('T')[0],
      })),
      monthlySales,
      categoryBreakdown: categoryBreakdownData,
      vendorPerformance: vendorPerformanceData,
    };
  }

  async getPerformanceMetrics() {
    // Top products by revenue
    const topProducts = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        subtotal: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          subtotal: 'desc',
        },
      },
      take: 10,
    });

    const topProductsData = await Promise.all(
      topProducts.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });
        return {
          id: item.productId,
          name: product?.name || 'Unknown Product',
          value: Number(item._sum.subtotal || 0),
          count: item._count.id,
        };
      }),
    );

    // Top categories by order count
    const topCategories = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 20,
    });

    const categoryMap = new Map();
    await Promise.all(
      topCategories.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          include: { category: true },
        });
        const categoryName = product?.category?.name || 'Unknown';
        const categoryId = product?.category?.id || 0;

        if (!categoryMap.has(categoryId)) {
          categoryMap.set(categoryId, {
            id: categoryId,
            name: categoryName,
            value: 0,
            count: 0,
          });
        }

        const existing = categoryMap.get(categoryId);
        existing.count += item._count.id;
        categoryMap.set(categoryId, existing);
      }),
    );

    const topCategoriesData = Array.from(categoryMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Top vendors by revenue
    const topVendors = await this.prisma.order.groupBy({
      by: ['vendorId'],
      _sum: {
        total: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          total: 'desc',
        },
      },
      take: 10,
    });

    const topVendorsData = await Promise.all(
      topVendors.map(async (item) => {
        const vendor = await this.prisma.vendorProfile.findUnique({
          where: { userId: item.vendorId },
        });
        return {
          id: item.vendorId,
          name: vendor?.storeName || 'Unknown Vendor',
          value: Number(item._sum.total || 0),
          count: item._count.id,
        };
      }),
    );

    // Top customers by spending
    const topCustomers = await this.prisma.order.groupBy({
      by: ['customerId'],
      _sum: {
        total: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          total: 'desc',
        },
      },
      take: 10,
    });

    const topCustomersData = await Promise.all(
      topCustomers.map(async (item) => {
        const customer = await this.prisma.customerProfile.findUnique({
          where: { userId: item.customerId },
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
        });
        return {
          id: item.customerId,
          name: customer?.user?.fullName || 'Unknown Customer',
          value: Number(item._sum.total || 0),
          count: item._count.id,
        };
      }),
    );

    return {
      topProducts: topProductsData,
      topCategories: topCategoriesData,
      topVendors: topVendorsData,
      topCustomers: topCustomersData,
    };
  }
}
