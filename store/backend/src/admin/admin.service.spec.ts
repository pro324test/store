import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AdminService', () => {
  let service: AdminService;
  let prisma: PrismaService;

  const mockPrismaService = {
    permission: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    systemStaffRole: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    systemStaffProfile: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    systemStaffRolePermission: {
      create: jest.fn(),
      delete: jest.fn(),
      createMany: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPermission', () => {
    it('should create a permission successfully', async () => {
      const permissionData = {
        permissionKey: 'test.permission',
        category: 'Test Category',
        categoryEn: 'Test Category',
      };

      const expectedResult = {
        id: 1,
        ...permissionData,
        description: null,
        descriptionEn: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.permission.create.mockResolvedValue(expectedResult);

      const result = await service.createPermission(permissionData);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.permission.create).toHaveBeenCalledWith({
        data: permissionData,
      });
    });
  });

  describe('createRole', () => {
    it('should create a role successfully', async () => {
      const roleData = {
        roleName: 'Test Role',
        roleNameEn: 'Test Role',
      };

      const expectedResult = {
        id: 1,
        ...roleData,
        description: null,
        descriptionEn: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        permissions: [],
      };

      mockPrismaService.systemStaffRole.create.mockResolvedValue({
        ...expectedResult,
        permissions: [],
      });

      const result = await service.createRole(roleData);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.systemStaffRole.create).toHaveBeenCalledWith({
        data: roleData,
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      });
    });
  });

  describe('assignPermissionToRole', () => {
    it('should assign permission to role successfully', async () => {
      const roleId = 1;
      const permissionId = 1;

      const expectedResult = {
        roleId,
        permissionId,
        role: { id: 1, roleName: 'Test Role' },
        permission: { id: 1, permissionKey: 'test.permission' },
      };

      mockPrismaService.systemStaffRolePermission.create.mockResolvedValue(expectedResult);

      const result = await service.assignPermissionToRole(roleId, permissionId);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.systemStaffRolePermission.create).toHaveBeenCalledWith({
        data: { roleId, permissionId },
        include: {
          role: true,
          permission: true,
        },
      });
    });
  });
});