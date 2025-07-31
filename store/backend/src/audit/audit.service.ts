import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async createAuditLog(data: {
    userId?: number;
    action: string;
    entityType: string;
    entityId?: string;
    oldValue?: any;
    newValue?: any;
    ipAddress?: string;
    requestPath?: string;
    userAgent?: string;
    status?: string;
    notes?: string;
  }) {
    return this.prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        oldValue: data.oldValue,
        newValue: data.newValue,
        ipAddress: data.ipAddress,
        requestPath: data.requestPath,
        userAgent: data.userAgent,
        status: data.status || 'SUCCESS',
        notes: data.notes,
      },
    });
  }

  async findAllLogs(limit = 100, offset = 0) {
    const logs = await this.prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return logs.map((log) => ({
      ...log,
      id: log.id.toString(), // Convert BigInt to string for GraphQL
    }));
  }

  async findLogsByUser(userId: number, limit = 50, offset = 0) {
    const logs = await this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: limit,
      skip: offset,
    });

    return logs.map((log) => ({
      ...log,
      id: log.id.toString(),
    }));
  }

  async findLogsByEntity(
    entityType: string,
    entityId?: string,
    limit = 50,
    offset = 0,
  ) {
    const where: any = { entityType };
    if (entityId) {
      where.entityId = entityId;
    }

    const logs = await this.prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return logs.map((log) => ({
      ...log,
      id: log.id.toString(),
    }));
  }

  async findLogsByAction(action: string, limit = 50, offset = 0) {
    const logs = await this.prisma.auditLog.findMany({
      where: { action },
      orderBy: { timestamp: 'desc' },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return logs.map((log) => ({
      ...log,
      id: log.id.toString(),
    }));
  }

  async findLogsByDateRange(
    startDate: Date,
    endDate: Date,
    limit = 100,
    offset = 0,
  ) {
    const logs = await this.prisma.auditLog.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return logs.map((log) => ({
      ...log,
      id: log.id.toString(),
    }));
  }

  async getAuditStats() {
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const [totalLogs, todayLogs, successfulActions, failedActions, topActions] =
      await Promise.all([
        this.prisma.auditLog.count(),
        this.prisma.auditLog.count({
          where: {
            timestamp: {
              gte: todayStart,
            },
          },
        }),
        this.prisma.auditLog.count({
          where: { status: 'SUCCESS' },
        }),
        this.prisma.auditLog.count({
          where: { status: { not: 'SUCCESS' } },
        }),
        this.getTopActions(),
      ]);

    return {
      totalLogs,
      todayLogs,
      successfulActions,
      failedActions,
      topActions,
    };
  }

  private async getTopActions(limit = 10) {
    const result = await this.prisma.auditLog.groupBy({
      by: ['action'],
      _count: {
        action: true,
      },
      orderBy: {
        _count: {
          action: 'desc',
        },
      },
      take: limit,
    });

    return result.map((item) => ({
      action: item.action,
      count: item._count.action,
    }));
  }

  // Helper methods for common audit actions
  async logUserAction(
    userId: number,
    action: string,
    entityType: string,
    entityId?: string,
    oldValue?: any,
    newValue?: any,
    ipAddress?: string,
    userAgent?: string,
  ) {
    return this.createAuditLog({
      userId,
      action,
      entityType,
      entityId,
      oldValue,
      newValue,
      ipAddress,
      userAgent,
      status: 'SUCCESS',
    });
  }

  async logSystemAction(
    action: string,
    entityType: string,
    entityId?: string,
    details?: any,
    notes?: string,
  ) {
    return this.createAuditLog({
      action,
      entityType,
      entityId,
      newValue: details,
      status: 'SUCCESS',
      notes,
    });
  }

  async logFailedAction(
    userId: number | undefined,
    action: string,
    entityType: string,
    error: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    return this.createAuditLog({
      userId,
      action,
      entityType,
      status: 'FAILED',
      notes: error,
      ipAddress,
      userAgent,
    });
  }

  async logProductUpdate(
    userId: number,
    productId: number,
    oldValue: any,
    newValue: any,
    ipAddress?: string,
  ) {
    return this.logUserAction(
      userId,
      'PRODUCT_UPDATE',
      'Product',
      productId.toString(),
      oldValue,
      newValue,
      ipAddress,
    );
  }

  async logOrderStatusChange(
    userId: number,
    orderId: number,
    oldStatus: string,
    newStatus: string,
    ipAddress?: string,
  ) {
    return this.logUserAction(
      userId,
      'ORDER_STATUS_CHANGE',
      'Order',
      orderId.toString(),
      { status: oldStatus },
      { status: newStatus },
      ipAddress,
    );
  }

  async logUserRoleChange(
    adminUserId: number,
    targetUserId: number,
    oldRoles: string[],
    newRoles: string[],
    ipAddress?: string,
  ) {
    return this.logUserAction(
      adminUserId,
      'USER_ROLE_CHANGE',
      'User',
      targetUserId.toString(),
      { roles: oldRoles },
      { roles: newRoles },
      ipAddress,
    );
  }
}
