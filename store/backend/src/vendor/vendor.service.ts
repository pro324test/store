import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class VendorService {
  constructor(private prisma: PrismaService) {}

  async applyToBeVendor(
    userId: number,
    applicationData: {
      storeName: string;
      storeNameEn: string;
      description?: string;
      descriptionEn?: string;
      businessLicense?: string;
      taxId?: string;
      phoneNumber?: string;
      email?: string;
      address?: string;
      cityId?: number;
    },
  ) {
    // Check if user already has a pending or approved application
    const existingRequest = await this.prisma.userRoleRequest.findFirst({
      where: {
        userId,
        requestedRole: UserRole.VENDOR,
        status: { in: ['PENDING', 'APPROVED'] },
      },
    });

    if (existingRequest) {
      throw new Error(
        'User already has a pending or approved vendor application',
      );
    }

    // Create vendor application
    const application = await this.prisma.userRoleRequest.create({
      data: {
        userId,
        requestedRole: UserRole.VENDOR,
        status: 'PENDING',
        submissionData: applicationData,
      },
    });

    return application;
  }

  async approveVendorApplication(applicationId: number, adminId: number) {
    const application = await this.prisma.userRoleRequest.findUnique({
      where: { id: applicationId },
      include: { user: true },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    if (application.status !== 'PENDING') {
      throw new Error('Application is not in pending status');
    }

    // Check if user already has a vendor profile (one shop per user constraint)
    const existingVendorProfile = await this.prisma.vendorProfile.findUnique({
      where: { userId: application.userId },
    });

    if (existingVendorProfile) {
      throw new Error('User already has a vendor profile. Only one shop per user is allowed.');
    }

    // Start transaction
    return this.prisma.$transaction(async (tx) => {
      // Update application status
      await tx.userRoleRequest.update({
        where: { id: applicationId },
        data: {
          status: 'APPROVED',
          adminNotes: 'Application approved',
        },
      });

      // Assign vendor role to user
      await tx.userRoleAssignment.create({
        data: {
          userId: application.userId,
          role: UserRole.VENDOR,
          isActive: true,
          isPrimary: false,
        },
      });

      // Create vendor profile
      const submissionData = application.submissionData as any;
      const vendorProfile = await tx.vendorProfile.create({
        data: {
          userId: application.userId,
          storeName: submissionData.storeName,
          storeNameEn: submissionData.storeNameEn,
          description: submissionData.description,
          descriptionEn: submissionData.descriptionEn,
          phoneNumber:
            submissionData.phoneNumber || application.user.phoneNumber,
          email: submissionData.email || application.user.email,
          address: submissionData.address,
          cityId: submissionData.cityId,
          slug: this.generateSlug(submissionData.storeName),
          isActive: true,
          isVerified: true,
          status: 'ACTIVE',
        },
      });

      // Create vendor balance record
      await tx.vendorBalance.create({
        data: {
          vendorId: application.userId,
        },
      });

      return vendorProfile;
    });
  }

  async rejectVendorApplication(
    applicationId: number,
    adminId: number,
    reason: string,
  ) {
    return this.prisma.userRoleRequest.update({
      where: { id: applicationId },
      data: {
        status: 'REJECTED',
        rejectionReason: reason,
        adminNotes: `Application rejected: ${reason}`,
      },
    });
  }

  async getPendingApplications(limit = 50, offset = 0) {
    return this.prisma.userRoleRequest.findMany({
      where: {
        requestedRole: UserRole.VENDOR,
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
      orderBy: { createdAt: 'asc' },
      take: limit,
      skip: offset,
    });
  }

  async getVendorProfile(userId: number) {
    return this.prisma.vendorProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            email: true,
          },
        },
        city: {
          include: {
            zone: true,
          },
        },
        balance: true,
      },
    });
  }

  async updateVendorProfile(
    userId: number,
    data: {
      storeName?: string;
      storeNameEn?: string;
      description?: string;
      descriptionEn?: string;
      phoneNumber?: string;
      email?: string;
      address?: string;
      cityId?: number;
      logoUrl?: string;
      bannerUrl?: string;
    },
  ) {
    return this.prisma.vendorProfile.update({
      where: { userId },
      data: {
        ...data,
        ...(data.storeName && { slug: this.generateSlug(data.storeName) }),
      },
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
