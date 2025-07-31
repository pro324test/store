import { Injectable } from '@nestjs/common';
// Temporarily disabled i18n
// import { I18nService } from 'nestjs-i18n';
import { PrismaService } from '../prisma/prisma.service';
import { UserRoleHistoryService } from './user-role-history.service';
import { UserRole } from './user-role-request.model';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private userRoleHistoryService: UserRoleHistoryService,
    // Temporarily disabled i18n
    // private readonly i18n: I18nService,
  ) {}

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        roles: true, // Include user roles
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: true,
      },
    });

    if (!user) {
      throw new Error('User not found'); // this.i18n.t('messages.user.notFound')
    }

    return user;
  }

  async findByPhoneNumber(phoneNumber: string) {
    return this.prisma.user.findUnique({
      where: { phoneNumber },
      include: {
        roles: true,
      },
    });
  }

  async create(data: {
    fullName: string;
    phoneNumber: string;
    email?: string;
    passwordHash: string;
  }) {
    try {
      const user = await this.prisma.user.create({
        data,
        include: {
          roles: true,
        },
      });

      return {
        ...user,
        message: 'User created successfully', // this.i18n.t('messages.user.created')
      };
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new Error('Phone number already exists'); // this.i18n.t('messages.user.phoneExists')
      }
      throw error;
    }
  }

  async update(
    id: number,
    data: {
      fullName?: string;
      phoneNumber?: string;
      email?: string;
    },
  ) {
    try {
      const updateData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined),
      );

      const user = await this.prisma.user.update({
        where: { id },
        data: updateData,
        include: {
          roles: true,
        },
      });

      return user;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new Error('Phone number already exists');
      }
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        throw new Error('User not found');
      }
      throw error;
    }
  }

  async toggleStatus(id: number) {
    const user = await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      include: {
        roles: true,
      },
    });
  }

  async assignRole(userId: number, role: string, isPrimary: boolean = false, changedById?: number) {
    try {
      // If setting as primary, make sure no other role is primary for this user
      if (isPrimary) {
        await this.prisma.userRoleAssignment.updateMany({
          where: { userId },
          data: { isPrimary: false },
        });
      }

      const roleAssignment = await this.prisma.userRoleAssignment.create({
        data: {
          userId,
          role: role as any, // Cast to enum
          isPrimary,
          isActive: true,
        },
      });

      // Log role assignment in history if changedById is provided
      if (changedById && this.userRoleHistoryService) {
        await this.userRoleHistoryService.logRoleAssignment(
          userId,
          role as UserRole,
          changedById,
          `Role assigned${isPrimary ? ' as primary role' : ''}`,
        );
      }

      return roleAssignment;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new Error('User already has this role');
      }
      throw error;
    }
  }

  async removeRole(userId: number, role: string, changedById?: number) {
    try {
      await this.prisma.userRoleAssignment.delete({
        where: {
          userId_role: {
            userId,
            role: role as any,
          },
        },
      });

      // Log role revocation in history if changedById is provided
      if (changedById && this.userRoleHistoryService) {
        await this.userRoleHistoryService.logRoleRevocation(
          userId,
          role as UserRole,
          changedById,
          'Role revoked',
        );
      }

      return true;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        throw new Error('Role assignment not found');
      }
      throw error;
    }
  }

  async updateRole(
    userId: number,
    role: string,
    data: { isActive?: boolean; isPrimary?: boolean },
    changedById?: number,
  ) {
    try {
      // If setting as primary, make sure no other role is primary for this user
      if (data.isPrimary) {
        await this.prisma.userRoleAssignment.updateMany({
          where: { userId },
          data: { isPrimary: false },
        });
      }

      const updateData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined),
      );

      const roleAssignment = await this.prisma.userRoleAssignment.update({
        where: {
          userId_role: {
            userId,
            role: role as any,
          },
        },
        data: updateData,
      });

      // Log primary role change in history if changedById is provided and isPrimary was changed
      if (changedById && data.isPrimary && this.userRoleHistoryService) {
        await this.userRoleHistoryService.logPrimaryRoleChange(
          userId,
          role as UserRole,
          changedById,
          'Primary role changed',
        );
      }

      return roleAssignment;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        throw new Error('Role assignment not found');
      }
      throw error;
    }
  }

  async delete(id: number) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        throw new Error('User not found');
      }
      throw error;
    }
  }
}
