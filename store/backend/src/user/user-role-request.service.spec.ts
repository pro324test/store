import { Test, TestingModule } from '@nestjs/testing';
import { UserRoleRequestService } from './user-role-request.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, UserRoleRequestStatus } from './user-role-request.model';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('UserRoleRequestService', () => {
  let service: UserRoleRequestService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    userRoleAssignment: {
      findUnique: jest.fn(),
    },
    userRoleRequest: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRoleRequestService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserRoleRequestService>(UserRoleRequestService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all role requests', async () => {
      const mockRequests = [
        {
          id: 1,
          userId: 1,
          requestedRole: UserRole.VENDOR,
          status: UserRoleRequestStatus.PENDING,
          user: { id: 1, fullName: 'Test User' },
        },
      ];

      mockPrismaService.userRoleRequest.findMany.mockResolvedValue(mockRequests);

      const result = await service.findAll();

      expect(result).toEqual(mockRequests);
      expect(mockPrismaService.userRoleRequest.findMany).toHaveBeenCalledWith({
        where: {},
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
    });

    it('should filter by userId when provided', async () => {
      const userId = 1;
      await service.findAll({ userId });

      expect(mockPrismaService.userRoleRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a role request by id', async () => {
      const mockRequest = {
        id: 1,
        userId: 1,
        requestedRole: UserRole.VENDOR,
        status: UserRoleRequestStatus.PENDING,
      };

      mockPrismaService.userRoleRequest.findUnique.mockResolvedValue(mockRequest);

      const result = await service.findOne(1);

      expect(result).toEqual(mockRequest);
      expect(mockPrismaService.userRoleRequest.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
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
    });

    it('should throw NotFoundException when role request not found', async () => {
      mockPrismaService.userRoleRequest.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createData = {
      userId: 1,
      requestedRole: UserRole.VENDOR,
      submissionData: { businessName: 'Test Business' },
    };

    it('should create a new role request', async () => {
      const mockUser = { id: 1, fullName: 'Test User' };
      const mockCreatedRequest = {
        id: 1,
        ...createData,
        status: UserRoleRequestStatus.PENDING,
        user: mockUser,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.userRoleAssignment.findUnique.mockResolvedValue(null);
      mockPrismaService.userRoleRequest.findFirst.mockResolvedValue(null);
      mockPrismaService.userRoleRequest.create.mockResolvedValue(mockCreatedRequest);

      const result = await service.create(createData);

      expect(result).toEqual(mockCreatedRequest);
      expect(mockPrismaService.userRoleRequest.create).toHaveBeenCalledWith({
        data: {
          userId: createData.userId,
          requestedRole: createData.requestedRole,
          submissionData: createData.submissionData,
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
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.create(createData)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when user already has the role', async () => {
      const mockUser = { id: 1, fullName: 'Test User' };
      const mockExistingRole = { userId: 1, role: UserRole.VENDOR };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.userRoleAssignment.findUnique.mockResolvedValue(mockExistingRole);

      await expect(service.create(createData)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when pending request already exists', async () => {
      const mockUser = { id: 1, fullName: 'Test User' };
      const mockPendingRequest = { id: 1, status: UserRoleRequestStatus.PENDING };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.userRoleAssignment.findUnique.mockResolvedValue(null);
      mockPrismaService.userRoleRequest.findFirst.mockResolvedValue(mockPendingRequest);

      await expect(service.create(createData)).rejects.toThrow(BadRequestException);
    });
  });

  describe('approve', () => {
    const mockRoleRequest = {
      id: 1,
      userId: 1,
      requestedRole: UserRole.VENDOR,
      status: UserRoleRequestStatus.PENDING,
    };

    it('should approve a pending role request', async () => {
      const processedById = 2;
      const adminNotes = 'Approved for vendor status';

      // Mock the service method call
      jest.spyOn(service, 'findOne').mockResolvedValue(mockRoleRequest as any);
      
      mockPrismaService.userRoleAssignment.findUnique.mockResolvedValue(null);
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          userRoleRequest: {
            update: jest.fn().mockResolvedValue({
              ...mockRoleRequest,
              status: UserRoleRequestStatus.APPROVED,
              processedById,
              adminNotes,
            }),
          },
          userRoleAssignment: {
            create: jest.fn().mockResolvedValue({
              userId: 1,
              role: UserRole.VENDOR,
              isActive: true,
              isPrimary: false,
            }),
          },
        });
      });

      const result = await service.approve(1, processedById, adminNotes);

      expect(result.status).toBe(UserRoleRequestStatus.APPROVED);
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });

    it('should throw BadRequestException for non-pending requests', async () => {
      const nonPendingRequest = {
        ...mockRoleRequest,
        status: UserRoleRequestStatus.APPROVED,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(nonPendingRequest as any);

      await expect(service.approve(1, 2)).rejects.toThrow(BadRequestException);
    });
  });

  describe('reject', () => {
    const mockRoleRequest = {
      id: 1,
      userId: 1,
      requestedRole: UserRole.VENDOR,
      status: UserRoleRequestStatus.PENDING,
    };

    it('should reject a pending role request', async () => {
      const processedById = 2;
      const rejectionReason = 'Insufficient documentation';

      jest.spyOn(service, 'findOne').mockResolvedValue(mockRoleRequest as any);
      
      const mockRejectedRequest = {
        ...mockRoleRequest,
        status: UserRoleRequestStatus.REJECTED,
        processedById,
        rejectionReason,
      };

      mockPrismaService.userRoleRequest.update.mockResolvedValue(mockRejectedRequest);

      const result = await service.reject(1, processedById, rejectionReason);

      expect(result.status).toBe(UserRoleRequestStatus.REJECTED);
      expect(result.rejectionReason).toBe(rejectionReason);
    });
  });
});