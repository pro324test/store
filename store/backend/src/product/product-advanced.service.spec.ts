import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';
import { AttributeType } from './product.model';

// Mock data
const mockProduct = {
  id: 1,
  vendorId: 1,
  categoryId: 1,
  name: 'Test Product',
  nameEn: 'Test Product',
  slug: 'test-product',
  price: 100,
  costPrice: 50,
  stockQuantity: 10,
  isActive: true,
  isPublished: true,
  isFeatured: false,
  trackInventory: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockFileUpload = {
  id: 1,
  originalName: 'test-image.jpg',
  filename: 'test-image-123.jpg',
  path: '/uploads/products/test-image-123.jpg',
  mimetype: 'image/jpeg',
  size: 50000,
  isPublic: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockProductImage = {
  id: 1,
  productId: 1,
  fileUploadId: 1,
  alt: 'Test Image',
  title: 'Test Product Image',
  sortOrder: 0,
  isDefault: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  product: mockProduct,
  fileUpload: mockFileUpload,
};

const mockProductAttribute = {
  id: 1,
  productId: 1,
  name: 'Color',
  nameEn: 'Color',
  options: ['Red', 'Blue', 'Green'],
  isRequired: false,
  isVariant: true,
  attributeType: AttributeType.COLOR,
  sortOrder: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  product: mockProduct,
  variationAttributes: [],
};

const mockProductVariation = {
  id: 1,
  productId: 1,
  sku: 'TEST-RED',
  price: 100,
  stockQuantity: 5,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  product: mockProduct,
  attributes: [],
};

describe('ProductService - Advanced Features', () => {
  let service: ProductService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    productImage: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
    },
    productAttribute: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    productVariation: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
    },
    productVariationAttribute: {
      createMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Product Images', () => {
    it('should get product images', async () => {
      mockPrismaService.productImage.findMany.mockResolvedValue([mockProductImage]);

      const result = await service.getProductImages(1);

      expect(mockPrismaService.productImage.findMany).toHaveBeenCalledWith({
        where: { productId: 1 },
        include: { 
          fileUpload: true,
          product: true 
        },
        orderBy: [
          { isDefault: 'desc' },
          { sortOrder: 'asc' }
        ],
      });
      expect(result).toEqual([mockProductImage]);
    });

    it('should create product image', async () => {
      const createData = {
        productId: 1,
        fileUploadId: 1,
        alt: 'Test Image',
        sortOrder: 0,
        isDefault: true,
      };

      mockPrismaService.productImage.updateMany.mockResolvedValue({});
      mockPrismaService.productImage.create.mockResolvedValue(mockProductImage);

      const result = await service.createProductImage(createData);

      expect(mockPrismaService.productImage.updateMany).toHaveBeenCalledWith({
        where: { productId: 1 },
        data: { isDefault: false },
      });
      expect(mockPrismaService.productImage.create).toHaveBeenCalledWith({
        data: {
          ...createData,
          isDefault: true,
        },
        include: { 
          fileUpload: true,
          product: true 
        },
      });
      expect(result).toEqual(mockProductImage);
    });

    it('should update product image', async () => {
      const updateData = {
        alt: 'Updated Alt Text',
        isDefault: false,
      };

      mockPrismaService.productImage.findUnique.mockResolvedValue({ productId: 1 });
      mockPrismaService.productImage.update.mockResolvedValue(mockProductImage);

      const result = await service.updateProductImage(1, updateData);

      expect(mockPrismaService.productImage.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: { productId: true },
      });
      expect(mockPrismaService.productImage.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
        include: { 
          fileUpload: true,
          product: true 
        },
      });
      expect(result).toEqual(mockProductImage);
    });

    it('should delete product image', async () => {
      mockPrismaService.productImage.delete.mockResolvedValue(mockProductImage);

      const result = await service.deleteProductImage(1);

      expect(mockPrismaService.productImage.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockProductImage);
    });

    it('should set default product image', async () => {
      mockPrismaService.productImage.findUnique.mockResolvedValue({ productId: 1 });
      mockPrismaService.productImage.updateMany.mockResolvedValue({});
      mockPrismaService.productImage.update.mockResolvedValue(mockProductImage);

      const result = await service.setDefaultProductImage(1);

      expect(mockPrismaService.productImage.updateMany).toHaveBeenCalledWith({
        where: { productId: 1 },
        data: { isDefault: false },
      });
      expect(mockPrismaService.productImage.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isDefault: true },
        include: { 
          fileUpload: true,
          product: true 
        },
      });
      expect(result).toEqual(mockProductImage);
    });
  });

  describe('Product Attributes', () => {
    it('should get product attributes', async () => {
      mockPrismaService.productAttribute.findMany.mockResolvedValue([mockProductAttribute]);

      const result = await service.getProductAttributes(1);

      expect(mockPrismaService.productAttribute.findMany).toHaveBeenCalledWith({
        where: { productId: 1 },
        include: { 
          product: true,
          variationAttributes: {
            include: {
              variation: true
            }
          }
        },
        orderBy: { sortOrder: 'asc' },
      });
      expect(result).toEqual([mockProductAttribute]);
    });

    it('should create product attribute', async () => {
      const createData = {
        productId: 1,
        name: 'Color',
        nameEn: 'Color',
        options: ['Red', 'Blue', 'Green'],
        attributeType: 'COLOR',
      };

      mockPrismaService.productAttribute.create.mockResolvedValue(mockProductAttribute);

      const result = await service.createProductAttribute(createData);

      expect(mockPrismaService.productAttribute.create).toHaveBeenCalledWith({
        data: {
          ...createData,
          isRequired: false,
          isVariant: true,
          sortOrder: 0,
        },
        include: { 
          product: true,
          variationAttributes: {
            include: {
              variation: true
            }
          }
        },
      });
      expect(result).toEqual(mockProductAttribute);
    });

    it('should update product attribute', async () => {
      const updateData = {
        name: 'Updated Color',
        options: ['Red', 'Blue', 'Green', 'Yellow'],
      };

      mockPrismaService.productAttribute.update.mockResolvedValue(mockProductAttribute);

      const result = await service.updateProductAttribute(1, updateData);

      expect(mockPrismaService.productAttribute.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          ...updateData,
          attributeType: undefined,
        },
        include: { 
          product: true,
          variationAttributes: {
            include: {
              variation: true
            }
          }
        },
      });
      expect(result).toEqual(mockProductAttribute);
    });

    it('should delete product attribute', async () => {
      mockPrismaService.productAttribute.delete.mockResolvedValue(mockProductAttribute);

      const result = await service.deleteProductAttribute(1);

      expect(mockPrismaService.productAttribute.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockProductAttribute);
    });
  });

  describe('Product Variations', () => {
    it('should get product variations', async () => {
      mockPrismaService.productVariation.findMany.mockResolvedValue([mockProductVariation]);

      const result = await service.getProductVariations(1);

      expect(mockPrismaService.productVariation.findMany).toHaveBeenCalledWith({
        where: { productId: 1 },
        include: { 
          product: true,
          attributes: {
            include: {
              attribute: true
            },
            orderBy: { sortOrder: 'asc' }
          }
        },
        orderBy: { createdAt: 'asc' },
      });
      expect(result).toEqual([mockProductVariation]);
    });

    it('should create product variation', async () => {
      const createData = {
        productId: 1,
        sku: 'TEST-RED',
        price: 100,
        stockQuantity: 5,
        attributes: [
          {
            attributeId: 1,
            value: 'Red',
            sortOrder: 0,
          },
        ],
      };

      const mockTransaction = jest.fn().mockImplementation(async (callback) => {
        const tx = {
          productVariation: {
            create: jest.fn().mockResolvedValue({ id: 1, ...createData }),
            findUnique: jest.fn().mockResolvedValue(mockProductVariation),
          },
          productVariationAttribute: {
            createMany: jest.fn().mockResolvedValue({}),
          },
        };
        return callback(tx);
      });

      mockPrismaService.$transaction.mockImplementation(mockTransaction);

      const result = await service.createProductVariation(createData);

      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(result).toEqual(mockProductVariation);
    });

    it('should update product variation', async () => {
      const updateData = {
        price: 120,
        stockQuantity: 8,
        attributes: [
          {
            attributeId: 1,
            value: 'Blue',
            sortOrder: 0,
          },
        ],
      };

      const mockTransaction = jest.fn().mockImplementation(async (callback) => {
        const tx = {
          productVariation: {
            update: jest.fn().mockResolvedValue({ id: 1, ...updateData }),
            findUnique: jest.fn().mockResolvedValue(mockProductVariation),
          },
          productVariationAttribute: {
            deleteMany: jest.fn().mockResolvedValue({}),
            createMany: jest.fn().mockResolvedValue({}),
          },
        };
        return callback(tx);
      });

      mockPrismaService.$transaction.mockImplementation(mockTransaction);

      const result = await service.updateProductVariation(1, updateData);

      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(result).toEqual(mockProductVariation);
    });

    it('should delete product variation', async () => {
      mockPrismaService.productVariation.delete.mockResolvedValue(mockProductVariation);

      const result = await service.deleteProductVariation(1);

      expect(mockPrismaService.productVariation.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockProductVariation);
    });

    it('should update variation stock', async () => {
      mockPrismaService.productVariation.update.mockResolvedValue(mockProductVariation);

      const result = await service.updateVariationStock(1, 15);

      expect(mockPrismaService.productVariation.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { stockQuantity: 15 },
        include: { 
          product: true,
          attributes: {
            include: {
              attribute: true
            },
            orderBy: { sortOrder: 'asc' }
          }
        },
      });
      expect(result).toEqual(mockProductVariation);
    });
  });

  describe('Enhanced Product Queries', () => {
    it('should find product by ID with details', async () => {
      const mockProductWithDetails = {
        ...mockProduct,
        category: { id: 1, name: 'Test Category' },
        images: [mockProductImage],
        attributes: [mockProductAttribute],
        variations: [mockProductVariation],
      };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProductWithDetails);

      const result = await service.findProductByIdWithDetails(1);

      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          category: true,
          subcategory: true,
          brand: true,
          images: {
            include: { fileUpload: true },
            orderBy: [
              { isDefault: 'desc' },
              { sortOrder: 'asc' }
            ]
          },
          attributes: {
            include: {
              variationAttributes: {
                include: { variation: true }
              }
            },
            orderBy: { sortOrder: 'asc' }
          },
          variations: {
            include: {
              attributes: {
                include: { attribute: true },
                orderBy: { sortOrder: 'asc' }
              }
            },
            where: { isActive: true },
            orderBy: { createdAt: 'asc' }
          }
        },
      });
      expect(result).toEqual(mockProductWithDetails);
    });

    it('should throw error when product not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.findProductByIdWithDetails(999)).rejects.toThrow('Product not found');
    });

    it('should find all products with details', async () => {
      const mockProductsWithDetails = [
        {
          ...mockProduct,
          images: [mockProductImage],
          attributes: [mockProductAttribute],
          variations: [mockProductVariation],
        }
      ];

      mockPrismaService.product.findMany.mockResolvedValue(mockProductsWithDetails);

      const result = await service.findAllProductsWithDetails(10, 0);

      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
          isPublished: true,
        },
        include: {
          category: true,
          subcategory: true,
          brand: true,
          images: {
            include: { fileUpload: true },
            orderBy: [
              { isDefault: 'desc' },
              { sortOrder: 'asc' }
            ],
            take: 1
          },
          attributes: {
            orderBy: { sortOrder: 'asc' }
          },
          variations: {
            where: { isActive: true },
            include: {
              attributes: {
                include: { attribute: true },
                orderBy: { sortOrder: 'asc' }
              }
            },
            orderBy: { price: 'asc' },
            take: 1
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
        skip: 0,
      });
      expect(result).toEqual(mockProductsWithDetails);
    });
  });
});