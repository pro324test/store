import { Test, TestingModule } from '@nestjs/testing';
import { UserRoleHistoryService } from './user-role-history.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, UserRoleHistoryAction } from './user-role-history.model';

describe('UserRoleHistoryService', () => {
  let service: UserRoleHistoryService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    userRoleHistoryItem: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRoleHistoryService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserRoleHistoryService>(UserRoleHistoryService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all role history items', async () => {
      const mockHistoryItems = [
        {
          id: 1,
          userId: 1,
          role: UserRole.VENDOR,
          action: UserRoleHistoryAction.ASSIGNED,
          changedById: 2,
          user: { id: 1, fullName: 'Test User' },
          changedBy: { id: 2, fullName: 'Admin User' },
        },
      ];

      mockPrismaService.userRoleHistoryItem.findMany.mockResolvedValue(mockHistoryItems);

      const result = await service.findAll();

      expect(result).toEqual(mockHistoryItems);
      expect(mockPrismaService.userRoleHistoryItem.findMany).toHaveBeenCalledWith({
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
    });

    it('should filter by userId when provided', async () => {
      const userId = 1;
      await service.findAll({ userId });

      expect(mockPrismaService.userRoleHistoryItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId },
        }),
      );
    });

    it('should filter by role when provided', async () => {
      const role = UserRole.VENDOR;
      await service.findAll({ role });

      expect(mockPrismaService.userRoleHistoryItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { role },
        }),
      );
    });
  });

  describe('create', () => {
    const createData = {
      userId: 1,
      role: UserRole.VENDOR,
      action: UserRoleHistoryAction.ASSIGNED,
      changedById: 2,
      reason: 'Approved vendor application',
    };

    it('should create a new role history item', async () => {
      const mockCreatedItem = {
        id: 1,
        ...createData,
        changedAt: new Date(),
        user: { id: 1, fullName: 'Test User' },
        changedBy: { id: 2, fullName: 'Admin User' },
      };

      mockPrismaService.userRoleHistoryItem.create.mockResolvedValue(mockCreatedItem);

      const result = await service.create(createData);

      expect(result).toEqual(mockCreatedItem);
      expect(mockPrismaService.userRoleHistoryItem.create).toHaveBeenCalledWith({
        data: {
          userId: createData.userId,
          role: createData.role,
          action: createData.action,
          changedById: createData.changedById,
          reason: createData.reason,
          profileId: undefined,
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
    });
  });

  describe('helper methods', () => {
    it('should log role assignment', async () => {
      const userId = 1;
      const role = UserRole.VENDOR;
      const changedById = 2;
      const reason = 'Approved vendor application';

      const mockCreatedItem = {
        id: 1,
        userId,
        role,
        action: UserRoleHistoryAction.ASSIGNED,
        changedById,
        reason,
      };

      mockPrismaService.userRoleHistoryItem.create.mockResolvedValue(mockCreatedItem);

      const result = await service.logRoleAssignment(userId, role, changedById, reason);

      expect(result).toEqual(mockCreatedItem);
      expect(mockPrismaService.userRoleHistoryItem.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: UserRoleHistoryAction.ASSIGNED,
          }),
        }),
      );
    });

    it('should log role revocation', async () => {
      const userId = 1;
      const role = UserRole.VENDOR;
      const changedById = 2;
      const reason = 'Vendor status revoked';

      const mockCreatedItem = {
        id: 1,
        userId,
        role,
        action: UserRoleHistoryAction.REVOKED,
        changedById,
        reason,
      };

      mockPrismaService.userRoleHistoryItem.create.mockResolvedValue(mockCreatedItem);

      const result = await service.logRoleRevocation(userId, role, changedById, reason);

      expect(result).toEqual(mockCreatedItem);
      expect(mockPrismaService.userRoleHistoryItem.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: UserRoleHistoryAction.REVOKED,
          }),
        }),
      );
    });

    it('should log primary role change', async () => {
      const userId = 1;
      const role = UserRole.VENDOR;
      const changedById = 2;
      const reason = 'Set as primary role';

      const mockCreatedItem = {
        id: 1,
        userId,
        role,
        action: UserRoleHistoryAction.PRIMARY_CHANGED,
        changedById,
        reason,
      };

      mockPrismaService.userRoleHistoryItem.create.mockResolvedValue(mockCreatedItem);

      const result = await service.logPrimaryRoleChange(userId, role, changedById, reason);

      expect(result).toEqual(mockCreatedItem);
      expect(mockPrismaService.userRoleHistoryItem.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: UserRoleHistoryAction.PRIMARY_CHANGED,
          }),
        }),
      );
    });
  });

  describe('getUserActivitySummary', () => {
    it('should return activity summary for a user', async () => {
      const userId = 1;
      const mockHistory = [
        {
          id: 1,
          userId,
          role: UserRole.VENDOR,
          action: UserRoleHistoryAction.ASSIGNED,
          changedAt: new Date('2023-01-01'),
        },
        {
          id: 2,
          userId,
          role: UserRole.CUSTOMER,
          action: UserRoleHistoryAction.REVOKED,
          changedAt: new Date('2023-01-02'),
        },
        {
          id: 3,
          userId,
          role: UserRole.VENDOR,
          action: UserRoleHistoryAction.PRIMARY_CHANGED,
          changedAt: new Date('2023-01-03'),
        },
      ];

      jest.spyOn(service, 'getUserRoleHistory').mockResolvedValue(mockHistory as any);

      const result = await service.getUserActivitySummary(userId);

      expect(result).toEqual({
        totalChanges: 3,
        roleAssignments: 1,
        roleRevocations: 1,
        primaryRoleChanges: 1,
        lastChange: new Date('2023-01-01'), // First item in desc order
        rolesAssigned: [UserRole.VENDOR],
        rolesRevoked: [UserRole.CUSTOMER],
      });
    });

    it('should handle empty history', async () => {
      const userId = 1;
      jest.spyOn(service, 'getUserRoleHistory').mockResolvedValue([]);

      const result = await service.getUserActivitySummary(userId);

      expect(result).toEqual({
        totalChanges: 0,
        roleAssignments: 0,
        roleRevocations: 0,
        primaryRoleChanges: 0,
        lastChange: null,
        rolesAssigned: [],
        rolesRevoked: [],
      });
    });
  });
});