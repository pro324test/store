import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, UserRoleHistoryAction } from './user-role-history.model';

@Injectable()
export class UserRoleHistoryService {
  constructor(private prisma: PrismaService) {}

  async findAll(options?: {
    userId?: number;
    role?: UserRole;
    action?: UserRoleHistoryAction;
    changedById?: number;
  }) {
    const whereClause: any = {};

    if (options?.userId) {
      whereClause.userId = options.userId;
    }

    if (options?.role) {
      whereClause.role = options.role;
    }

    if (options?.action) {
      whereClause.action = options.action;
    }

    if (options?.changedById) {
      whereClause.changedById = options.changedById;
    }

    return this.prisma.userRoleHistoryItem.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            email: true,
          },
        },
        changedBy: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            email: true,
          },
        },
      },
      orderBy: {
        changedAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.userRoleHistoryItem.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            email: true,
          },
        },
        changedBy: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            email: true,
          },
        },
      },
    });
  }

  async create(data: {
    userId: number;
    role: UserRole;
    action: UserRoleHistoryAction;
    changedById: number;
    reason?: string;
    profileId?: number;
  }) {
    return this.prisma.userRoleHistoryItem.create({
      data: {
        userId: data.userId,
        role: data.role as any,
        action: data.action,
        changedById: data.changedById,
        reason: data.reason,
        profileId: data.profileId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            email: true,
          },
        },
        changedBy: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            email: true,
          },
        },
      },
    });
  }

  async getUserRoleHistory(userId: number) {
    return this.findAll({ userId });
  }

  async getRoleHistory(role: UserRole) {
    return this.findAll({ role });
  }

  async getChangesBy(changedById: number) {
    return this.findAll({ changedById });
  }

  // Helper method to log role assignment
  async logRoleAssignment(
    userId: number,
    role: UserRole,
    changedById: number,
    reason?: string,
    profileId?: number,
  ) {
    return this.create({
      userId,
      role,
      action: UserRoleHistoryAction.ASSIGNED,
      changedById,
      reason,
      profileId,
    });
  }

  // Helper method to log role revocation
  async logRoleRevocation(
    userId: number,
    role: UserRole,
    changedById: number,
    reason?: string,
  ) {
    return this.create({
      userId,
      role,
      action: UserRoleHistoryAction.REVOKED,
      changedById,
      reason,
    });
  }

  // Helper method to log primary role change
  async logPrimaryRoleChange(
    userId: number,
    role: UserRole,
    changedById: number,
    reason?: string,
  ) {
    return this.create({
      userId,
      role,
      action: UserRoleHistoryAction.PRIMARY_CHANGED,
      changedById,
      reason,
    });
  }

  // Get activity summary for a user
  async getUserActivitySummary(userId: number) {
    const history = await this.getUserRoleHistory(userId);
    
    const summary = {
      totalChanges: history.length,
      roleAssignments: history.filter(h => h.action === 'ASSIGNED').length,
      roleRevocations: history.filter(h => h.action === 'REVOKED').length,
      primaryRoleChanges: history.filter(h => h.action === 'PRIMARY_CHANGED').length,
      lastChange: history[0]?.changedAt || null,
      rolesAssigned: [...new Set(history.filter(h => h.action === 'ASSIGNED').map(h => h.role))],
      rolesRevoked: [...new Set(history.filter(h => h.action === 'REVOKED').map(h => h.role))],
    };

    return summary;
  }
}