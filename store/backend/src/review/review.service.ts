import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async findReviewsByProduct(productId: number, limit = 20, offset = 0) {
    return this.prisma.productReview.findMany({
      where: {
        productId,
        status: 'APPROVED',
      },
      include: {
        customer: {
          include: {
            user: {
              select: {
                fullName: true,
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

  async findReviewsByCustomer(customerId: number, limit = 20, offset = 0) {
    return this.prisma.productReview.findMany({
      where: { customerId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            nameEn: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async findReviewById(id: number) {
    return this.prisma.productReview.findUnique({
      where: { id },
      include: {
        customer: {
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            nameEn: true,
            slug: true,
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
          },
        },
      },
    });
  }

  async createReview(data: {
    productId: number;
    customerId: number;
    orderId?: number;
    rating: number;
    title?: string;
    comment?: string;
  }) {
    // Check if customer has purchased this product
    let isVerifiedPurchase = false;
    if (data.orderId) {
      const orderItem = await this.prisma.orderItem.findFirst({
        where: {
          orderId: data.orderId,
          productId: data.productId,
          order: {
            customerId: data.customerId,
            status: 'DELIVERED',
          },
        },
      });
      isVerifiedPurchase = !!orderItem;
    }

    return this.prisma.productReview.create({
      data: {
        productId: data.productId,
        customerId: data.customerId,
        orderId: data.orderId,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
        isVerifiedPurchase,
        status: 'PENDING', // Default to pending approval
      },
    });
  }

  async updateReview(
    id: number,
    data: {
      rating?: number;
      title?: string;
      comment?: string;
      status?: string;
    },
  ) {
    return this.prisma.productReview.update({
      where: { id },
      data,
    });
  }

  async deleteReview(id: number) {
    return this.prisma.productReview.delete({
      where: { id },
    });
  }

  async approveReview(id: number) {
    return this.prisma.productReview.update({
      where: { id },
      data: { status: 'APPROVED' },
    });
  }

  async rejectReview(id: number) {
    return this.prisma.productReview.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
  }

  async getProductRatingsSummary(productId: number) {
    const reviews = await this.prisma.productReview.findMany({
      where: {
        productId,
        status: 'APPROVED',
      },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return {
        productId,
        averageRating: 0,
        totalReviews: 0,
        breakdown: [
          { stars: 5, count: 0, percentage: 0 },
          { stars: 4, count: 0, percentage: 0 },
          { stars: 3, count: 0, percentage: 0 },
          { stars: 2, count: 0, percentage: 0 },
          { stars: 1, count: 0, percentage: 0 },
        ],
      };
    }

    const totalReviews = reviews.length;
    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

    // Calculate breakdown
    const breakdown = [5, 4, 3, 2, 1].map((stars) => {
      const count = reviews.filter((review) => review.rating === stars).length;
      const percentage = (count / totalReviews) * 100;
      return { stars, count, percentage: Math.round(percentage * 10) / 10 };
    });

    return {
      productId,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      breakdown,
    };
  }

  async getPendingReviews(limit = 50, offset = 0) {
    return this.prisma.productReview.findMany({
      where: { status: 'PENDING' },
      include: {
        customer: {
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            nameEn: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async canCustomerReviewProduct(
    customerId: number,
    productId: number,
  ): Promise<boolean> {
    // Check if customer has a delivered order with this product and hasn't reviewed it yet
    const hasDeliveredOrder = await this.prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          customerId,
          status: 'DELIVERED',
        },
      },
    });

    if (!hasDeliveredOrder) {
      return false;
    }

    // Check if already reviewed
    const existingReview = await this.prisma.productReview.findFirst({
      where: {
        productId,
        customerId,
      },
    });

    return !existingReview;
  }
}
