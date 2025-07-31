import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, UserRoleRequestStatus } from './user-role-request.model';

@Injectable()
export class UserRoleRequestService {
  constructor(private prisma: PrismaService) {}

  async findAll(options?: {
    userId?: number;
    status?: UserRoleRequestStatus;
    requestedRole?: UserRole;
  }) {
    const whereClause: any = {};

    if (options?.userId) {
      whereClause.userId = options.userId;
    }

    if (options?.status) {
      whereClause.status = options.status;
    }

    if (options?.requestedRole) {
      whereClause.requestedRole = options.requestedRole;
    }

    return this.prisma.userRoleRequest.findMany({
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
        processedBy: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const roleRequest = await this.prisma.userRoleRequest.findUnique({
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
        processedBy: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            email: true,
          },
        },
      },
    });

    if (!roleRequest) {
      throw new NotFoundException('Role request not found');
    }

    return roleRequest;
  }

  async create(data: {
    userId: number;
    requestedRole: UserRole;
    submissionData: any;
  }) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user already has this role
    const existingRole = await this.prisma.userRoleAssignment.findUnique({
      where: {
        userId_role: {
          userId: data.userId,
          role: data.requestedRole as any,
        },
      },
    });

    if (existingRole) {
      throw new BadRequestException('User already has this role');
    }

    // Check if there's already a pending request for this role
    const pendingRequest = await this.prisma.userRoleRequest.findFirst({
      where: {
        userId: data.userId,
        requestedRole: data.requestedRole as any,
        status: 'PENDING',
      },
    });

    if (pendingRequest) {
      throw new BadRequestException('There is already a pending request for this role');
    }

    return this.prisma.userRoleRequest.create({
      data: {
        userId: data.userId,
        requestedRole: data.requestedRole as any,
        submissionData: data.submissionData,
        status: 'PENDING',
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
      },
    });
  }

  async approve(
    id: number,
    processedById: number,
    adminNotes?: string,
  ) {
    const roleRequest = await this.findOne(id);

    if (roleRequest.status !== 'PENDING') {
      throw new BadRequestException('Only pending requests can be approved');
    }

    // Check if user already has this role (double-check)
    const existingRole = await this.prisma.userRoleAssignment.findUnique({
      where: {
        userId_role: {
          userId: roleRequest.userId,
          role: roleRequest.requestedRole as any,
        },
      },
    });

    if (existingRole) {
      throw new BadRequestException('User already has this role');
    }

    // Start transaction to approve request and assign role
    return this.prisma.$transaction(async (prisma) => {
      // Update the request status
      const updatedRequest = await prisma.userRoleRequest.update({
        where: { id },
        data: {
          status: 'APPROVED',
          processedAt: new Date(),
          processedById,
          adminNotes,
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
          processedBy: {
            select: {
              id: true,
              fullName: true,
              phoneNumber: true,
              email: true,
            },
          },
        },
      });

      // Assign the role to the user
      await prisma.userRoleAssignment.create({
        data: {
          userId: roleRequest.userId,
          role: roleRequest.requestedRole as any,
          isActive: true,
          isPrimary: false,
        },
      });

      return updatedRequest;
    });
  }

  async reject(
    id: number,
    processedById: number,
    rejectionReason: string,
    adminNotes?: string,
  ) {
    const roleRequest = await this.findOne(id);

    if (roleRequest.status !== 'PENDING') {
      throw new BadRequestException('Only pending requests can be rejected');
    }

    return this.prisma.userRoleRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        processedAt: new Date(),
        processedById,
        rejectionReason,
        adminNotes,
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
        processedBy: {
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

  async cancel(id: number, userId: number) {
    const roleRequest = await this.findOne(id);

    // Only the user who made the request can cancel it
    if (roleRequest.userId !== userId) {
      throw new BadRequestException('You can only cancel your own requests');
    }

    if (roleRequest.status !== 'PENDING') {
      throw new BadRequestException('Only pending requests can be cancelled');
    }

    return this.prisma.userRoleRequest.delete({
      where: { id },
    });
  }

  async getUserRequests(userId: number) {
    return this.prisma.userRoleRequest.findMany({
      where: { userId },
      include: {
        processedBy: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getPendingRequests() {
    return this.findAll({ status: UserRoleRequestStatus.PENDING });
  }
}