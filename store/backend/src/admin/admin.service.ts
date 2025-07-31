import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ==================== SystemStaffProfile Operations ====================

  async createStaffProfile(data: {
    userId: number;
    roleId: number;
    employeeId?: string;
  }) {
    try {
      const staffProfile = await this.prisma.systemStaffProfile.create({
        data,
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      });

      // Transform the data to match GraphQL expectations
      return {
        ...staffProfile,
        role: {
          ...staffProfile.role,
          permissions: staffProfile.role.permissions.map((rp) => rp.permission),
        },
      };
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new Error('Staff profile already exists for this user');
      }
      throw error;
    }
  }

  async findAllStaffProfiles() {
    const staffProfiles = await this.prisma.systemStaffProfile.findMany({
      include: {
        user: true,
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    // Transform the data to match GraphQL expectations
    return staffProfiles.map((profile) => ({
      ...profile,
      role: {
        ...profile.role,
        permissions: profile.role.permissions.map((rp) => rp.permission),
      },
    }));
  }

  async findStaffProfile(userId: number) {
    const staffProfile = await this.prisma.systemStaffProfile.findUnique({
      where: { userId },
      include: {
        user: true,
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!staffProfile) {
      throw new Error('Staff profile not found');
    }

    // Transform the data to match GraphQL expectations
    return {
      ...staffProfile,
      role: {
        ...staffProfile.role,
        permissions: staffProfile.role.permissions.map((rp) => rp.permission),
      },
    };
  }

  async updateStaffProfile(
    userId: number,
    data: {
      roleId?: number;
      employeeId?: string;
      isActive?: boolean;
      leftAt?: Date;
    },
  ) {
    try {
      const updateData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined),
      );

      const staffProfile = await this.prisma.systemStaffProfile.update({
        where: { userId },
        data: updateData,
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      });

      // Transform the data to match GraphQL expectations
      return {
        ...staffProfile,
        role: {
          ...staffProfile.role,
          permissions: staffProfile.role.permissions.map((rp) => rp.permission),
        },
      };
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        throw new Error('Staff profile not found');
      }
      throw error;
    }
  }

  async deleteStaffProfile(userId: number) {
    try {
      await this.prisma.systemStaffProfile.delete({
        where: { userId },
      });
      return true;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        throw new Error('Staff profile not found');
      }
      throw error;
    }
  }

  // ==================== SystemStaffRole Operations ====================

  async createRole(data: {
    roleName: string;
    roleNameEn: string;
    description?: string;
    descriptionEn?: string;
  }) {
    try {
      const role = await this.prisma.systemStaffRole.create({
        data,
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      });

      // Transform the data to match GraphQL expectations
      return {
        ...role,
        permissions: role.permissions.map((rp) => rp.permission),
      };
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new Error('Role name already exists');
      }
      throw error;
    }
  }

  async findAllRoles() {
    const roles = await this.prisma.systemStaffRole.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        staffProfiles: {
          include: {
            user: true,
          },
        },
      },
    });

    // Transform the data to match GraphQL expectations
    return roles.map((role) => ({
      ...role,
      permissions: role.permissions.map((rp) => rp.permission),
    }));
  }

  async findRole(id: number) {
    const role = await this.prisma.systemStaffRole.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        staffProfiles: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!role) {
      throw new Error('Role not found');
    }

    // Transform the data to match GraphQL expectations
    return {
      ...role,
      permissions: role.permissions.map((rp) => rp.permission),
    };
  }

  async updateRole(
    id: number,
    data: {
      roleName?: string;
      roleNameEn?: string;
      description?: string;
      descriptionEn?: string;
    },
  ) {
    try {
      const updateData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined),
      );

      const role = await this.prisma.systemStaffRole.update({
        where: { id },
        data: updateData,
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      });

      // Transform the data to match GraphQL expectations
      return {
        ...role,
        permissions: role.permissions.map((rp) => rp.permission),
      };
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        throw new Error('Role not found');
      }
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new Error('Role name already exists');
      }
      throw error;
    }
  }

  async deleteRole(id: number) {
    try {
      await this.prisma.systemStaffRole.delete({
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
        throw new Error('Role not found');
      }
      throw error;
    }
  }

  // ==================== Permission Operations ====================

  async createPermission(data: {
    permissionKey: string;
    category: string;
    categoryEn: string;
    description?: string;
    descriptionEn?: string;
  }) {
    try {
      const permission = await this.prisma.permission.create({
        data,
      });
      return permission;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new Error('Permission key already exists');
      }
      throw error;
    }
  }

  async findAllPermissions() {
    return this.prisma.permission.findMany({
      orderBy: [{ category: 'asc' }, { permissionKey: 'asc' }],
    });
  }

  async findPermissionsByCategory(category: string) {
    return this.prisma.permission.findMany({
      where: { category },
      orderBy: { permissionKey: 'asc' },
    });
  }

  async findPermission(id: number) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      throw new Error('Permission not found');
    }

    return permission;
  }

  async updatePermission(
    id: number,
    data: {
      permissionKey?: string;
      category?: string;
      categoryEn?: string;
      description?: string;
      descriptionEn?: string;
    },
  ) {
    try {
      const updateData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined),
      );

      const permission = await this.prisma.permission.update({
        where: { id },
        data: updateData,
      });

      return permission;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        throw new Error('Permission not found');
      }
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new Error('Permission key already exists');
      }
      throw error;
    }
  }

  async deletePermission(id: number) {
    try {
      await this.prisma.permission.delete({
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
        throw new Error('Permission not found');
      }
      throw error;
    }
  }

  // ==================== Role-Permission Operations ====================

  async assignPermissionToRole(roleId: number, permissionId: number) {
    try {
      const rolePermission = await this.prisma.systemStaffRolePermission.create(
        {
          data: {
            roleId,
            permissionId,
          },
          include: {
            role: true,
            permission: true,
          },
        },
      );
      return rolePermission;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new Error('Permission already assigned to this role');
      }
      throw error;
    }
  }

  async removePermissionFromRole(roleId: number, permissionId: number) {
    try {
      await this.prisma.systemStaffRolePermission.delete({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId,
          },
        },
      });
      return true;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        throw new Error('Permission assignment not found');
      }
      throw error;
    }
  }

  async assignMultiplePermissionsToRole(
    roleId: number,
    permissionIds: number[],
  ) {
    await this.prisma.systemStaffRolePermission.createMany({
      data: permissionIds.map((permissionId) => ({
        roleId,
        permissionId,
      })),
      skipDuplicates: true, // Skip if already exists
    });
    return true;
  }

  async getRolePermissions(roleId: number) {
    return this.prisma.systemStaffRolePermission.findMany({
      where: { roleId },
      include: {
        permission: true,
      },
    });
  }

  async getAllCategories() {
    const categories = await this.prisma.permission.findMany({
      select: {
        category: true,
        categoryEn: true,
      },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    return categories;
  }

  // ==================== Dashboard Statistics ====================

  async getDashboardStats() {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalVendors,
      activeUsersCount,
      pendingOrdersCount,
      recentOrders,
    ] = await Promise.all([
      // Total users count
      this.prisma.user.count({
        where: { isActive: true },
      }),
      
      // Total products count  
      this.prisma.product.count({
        where: { isActive: true, isPublished: true },
      }),
      
      // Total orders count
      this.prisma.order.count(),
      
      // Total vendors count
      this.prisma.vendorProfile.count({
        where: { isActive: true },
      }),
      
      // Active users in last 30 days
      this.prisma.user.count({
        where: {
          isActive: true,
          lastLoginAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          },
        },
      }),
      
      // Pending orders count
      this.prisma.order.count({
        where: { status: 'PENDING' },
      }),
      
      // Recent orders for activity feed
      this.prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            include: { user: { select: { fullName: true } } },
          },
          vendor: {
            select: { storeName: true },
          },
        },
      }),
    ]);

    // Calculate growth percentages (simplified - comparing with previous period)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

    const [
      usersLastMonth,
      productsLastMonth,
      ordersLastMonth,
    ] = await Promise.all([
      this.prisma.user.count({
        where: {
          isActive: true,
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo,
          },
        },
      }),
      this.prisma.product.count({
        where: {
          isActive: true,
          isPublished: true,
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo,
          },
        },
      }),
      this.prisma.order.count({
        where: {
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo,
          },
        },
      }),
    ]);

    const [
      usersThisMonth,
      productsThisMonth,
      ordersThisMonth,
    ] = await Promise.all([
      this.prisma.user.count({
        where: {
          isActive: true,
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      this.prisma.product.count({
        where: {
          isActive: true,
          isPublished: true,
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      this.prisma.order.count({
        where: {
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
    ]);

    // Calculate growth percentages
    const userGrowth = usersLastMonth > 0 
      ? Math.round(((usersThisMonth - usersLastMonth) / usersLastMonth) * 100) 
      : 0;
    
    const productGrowth = productsLastMonth > 0 
      ? Math.round(((productsThisMonth - productsLastMonth) / productsLastMonth) * 100) 
      : 0;
    
    const orderGrowth = ordersLastMonth > 0 
      ? Math.round(((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100) 
      : 0;

    // System health check (simplified)
    const systemHealth = await this.checkSystemHealth();

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalVendors,
      activeUsersCount,
      pendingOrdersCount,
      userGrowth,
      productGrowth,
      orderGrowth,
      systemHealth,
      recentActivity: recentOrders.map(order => ({
        id: order.id,
        type: 'ORDER',
        description: `New order #${order.orderNumber} from ${order.customer.user.fullName}`,
        storeName: order.vendor.storeName,
        amount: order.total,
        createdAt: order.createdAt,
        status: order.status,
      })),
    };
  }

  private async checkSystemHealth() {
    try {
      // Check database connectivity
      await this.prisma.$queryRaw`SELECT 1`;
      
      // Check for any critical system issues
      const criticalIssues = await Promise.all([
        // Check for orders stuck in processing for too long
        this.prisma.order.count({
          where: {
            status: 'PROCESSING',
            createdAt: {
              lt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
            },
          },
        }),
        
        // Check for failed deliveries
        this.prisma.delivery.count({
          where: {
            status: 'FAILED',
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
        }),
      ]);

      const [stuckOrders, failedDeliveries] = criticalIssues;
      
      if (stuckOrders > 10 || failedDeliveries > 5) {
        return {
          status: 'WARNING',
          message: 'Some system issues detected',
          details: {
            stuckOrders,
            failedDeliveries,
          },
        };
      }

      return {
        status: 'HEALTHY',
        message: 'All systems operational',
        details: {
          stuckOrders,
          failedDeliveries,
        },
      };
    } catch (error) {
      return {
        status: 'ERROR',
        message: 'Database connectivity issues',
        details: { error: error.message },
      };
    }
  }
}
