import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface NotificationData {
  userId: number;
  title: string;
  titleEn: string;
  message: string;
  messageEn: string;
  type: 'ORDER_UPDATE' | 'VENDOR_APPLICATION' | 'PAYMENT' | 'GENERAL';
  actionUrl?: string;
  actionData?: any;
}

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async createNotification(data: NotificationData) {
    return this.prisma.userNotification.create({
      data: {
        userId: data.userId,
        title: data.title,
        titleEn: data.titleEn,
        message: data.message,
        messageEn: data.messageEn,
        type: data.type,
        isRead: false,
      },
    });
  }

  async sendOrderStatusNotification(
    userId: number,
    orderId: number,
    status: string,
  ) {
    const orderMessages = {
      CONFIRMED: {
        ar: {
          title: 'تم تأكيد طلبك',
          message: 'تم تأكيد طلبك وسيتم تجهيزه قريباً',
        },
        en: {
          title: 'Order Confirmed',
          message: 'Your order has been confirmed and will be prepared soon',
        },
      },
      OUT_FOR_DELIVERY: {
        ar: { title: 'في الطريق إليك', message: 'طلبك في الطريق إليك' },
        en: {
          title: 'Out for Delivery',
          message: 'Your order is on its way to you',
        },
      },
      DELIVERED: {
        ar: { title: 'تم التوصيل', message: 'تم توصيل طلبك بنجاح' },
        en: {
          title: 'Delivered',
          message: 'Your order has been delivered successfully',
        },
      },
      CANCELLED: {
        ar: { title: 'تم إلغاء الطلب', message: 'تم إلغاء طلبك' },
        en: {
          title: 'Order Cancelled',
          message: 'Your order has been cancelled',
        },
      },
    };

    const message = orderMessages[status];
    if (message) {
      await this.createNotification({
        userId,
        title: message.ar.title,
        titleEn: message.en.title,
        message: message.ar.message,
        messageEn: message.en.message,
        type: 'ORDER_UPDATE',
        actionUrl: `/orders/${orderId}`,
        actionData: { orderId, status },
      });
    }
  }

  async sendVendorApplicationNotification(
    userId: number,
    status: 'APPROVED' | 'REJECTED',
  ) {
    const messages = {
      APPROVED: {
        ar: {
          title: 'تم قبول طلبك',
          message: 'تم قبول طلب التاجر الخاص بك، يمكنك الآن إضافة منتجاتك',
        },
        en: {
          title: 'Application Approved',
          message:
            'Your vendor application has been approved, you can now add your products',
        },
      },
      REJECTED: {
        ar: {
          title: 'تم رفض طلبك',
          message: 'تم رفض طلب التاجر الخاص بك، يرجى مراجعة المتطلبات',
        },
        en: {
          title: 'Application Rejected',
          message:
            'Your vendor application has been rejected, please review the requirements',
        },
      },
    };

    const message = messages[status];
    await this.createNotification({
      userId,
      title: message.ar.title,
      titleEn: message.en.title,
      message: message.ar.message,
      messageEn: message.en.message,
      type: 'VENDOR_APPLICATION',
      actionUrl: '/vendor/profile',
    });
  }

  async getUserNotifications(userId: number, limit = 50, offset = 0) {
    return this.prisma.userNotification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async markAsRead(notificationId: number, userId: number) {
    return this.prisma.userNotification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        isRead: true,
      },
    });
  }

  async markAllAsRead(userId: number) {
    return this.prisma.userNotification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  async getUnreadCount(userId: number): Promise<number> {
    return this.prisma.userNotification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }
}
