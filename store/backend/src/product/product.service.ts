import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async findAllCategories() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      include: {
        subcategories: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findAllBrands() {
    return this.prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findAllProducts(limit = 20, offset = 0) {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        isPublished: true,
      },
      include: {
        category: true,
        subcategory: true,
        brand: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async findFeaturedProducts(limit = 10) {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
        isPublished: true,
      },
      include: {
        category: true,
        subcategory: true,
        brand: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async findProductById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        subcategory: true,
        brand: true,
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async findProductsByCategory(categoryId: number, limit = 20, offset = 0) {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        isPublished: true,
        categoryId: categoryId,
      },
      include: {
        category: true,
        subcategory: true,
        brand: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async findProductsByBrand(brandId: number, limit = 20, offset = 0) {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        isPublished: true,
        brandId: brandId,
      },
      include: {
        category: true,
        subcategory: true,
        brand: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  // Category CRUD operations
  async createCategory(data: {
    name: string;
    nameEn: string;
    slug: string;
    description?: string;
    descriptionEn?: string;
    imageUrl?: string;
    iconUrl?: string;
    bannerUrl?: string;
    sortOrder?: number;
    isActive?: boolean;
    showInMenu?: boolean;
    isFeatured?: boolean;
  }) {
    return this.prisma.category.create({
      data: {
        ...data,
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isActive ?? true,
        showInMenu: data.showInMenu ?? true,
        isFeatured: data.isFeatured ?? false,
      },
      include: {
        subcategories: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  async updateCategory(
    id: number,
    data: {
      name?: string;
      nameEn?: string;
      slug?: string;
      description?: string;
      descriptionEn?: string;
      imageUrl?: string;
      iconUrl?: string;
      bannerUrl?: string;
      sortOrder?: number;
      isActive?: boolean;
      showInMenu?: boolean;
      isFeatured?: boolean;
    },
  ) {
    return this.prisma.category.update({
      where: { id },
      data,
      include: {
        subcategories: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  async deleteCategory(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
  }

  // Subcategory CRUD operations
  async createSubcategory(data: {
    name: string;
    nameEn: string;
    slug: string;
    categoryId: number;
    description?: string;
    descriptionEn?: string;
    imageUrl?: string;
    iconUrl?: string;
    bannerUrl?: string;
    sortOrder?: number;
    isActive?: boolean;
    showInMenu?: boolean;
    isFeatured?: boolean;
  }) {
    return this.prisma.subcategory.create({
      data: {
        ...data,
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isActive ?? true,
        showInMenu: data.showInMenu ?? true,
        isFeatured: data.isFeatured ?? false,
      },
      include: {
        category: true,
      },
    });
  }

  async updateSubcategory(
    id: number,
    data: {
      name?: string;
      nameEn?: string;
      slug?: string;
      categoryId?: number;
      description?: string;
      descriptionEn?: string;
      imageUrl?: string;
      iconUrl?: string;
      bannerUrl?: string;
      sortOrder?: number;
      isActive?: boolean;
      showInMenu?: boolean;
      isFeatured?: boolean;
    },
  ) {
    return this.prisma.subcategory.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  async deleteSubcategory(id: number) {
    return this.prisma.subcategory.delete({
      where: { id },
    });
  }

  async findSubcategoriesByCategory(categoryId: number) {
    return this.prisma.subcategory.findMany({
      where: {
        categoryId,
        isActive: true,
      },
      include: {
        category: true,
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  // Brand CRUD operations
  async createBrand(data: {
    name: string;
    nameEn: string;
    slug: string;
    logoUrl?: string;
    description?: string;
    descriptionEn?: string;
    websiteUrl?: string;
    featured?: boolean;
    isActive?: boolean;
  }) {
    return this.prisma.brand.create({
      data: {
        ...data,
        featured: data.featured ?? false,
        isActive: data.isActive ?? true,
      },
    });
  }

  async updateBrand(
    id: number,
    data: {
      name?: string;
      nameEn?: string;
      slug?: string;
      logoUrl?: string;
      description?: string;
      descriptionEn?: string;
      websiteUrl?: string;
      featured?: boolean;
      isActive?: boolean;
    },
  ) {
    return this.prisma.brand.update({
      where: { id },
      data,
    });
  }

  async deleteBrand(id: number) {
    return this.prisma.brand.delete({
      where: { id },
    });
  }

  // Inventory Management
  async updateInventory(
    productId: number,
    quantity: number,
    operation: 'ADD' | 'SUBTRACT' | 'SET',
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { stockQuantity: true, lowStockAlert: true },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    let newInventory: number;
    switch (operation) {
      case 'ADD':
        newInventory = product.stockQuantity + quantity;
        break;
      case 'SUBTRACT':
        newInventory = Math.max(0, product.stockQuantity - quantity);
        break;
      case 'SET':
        newInventory = Math.max(0, quantity);
        break;
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: {
        stockQuantity: newInventory,
      },
    });

    return updatedProduct;
  }

  async getLowStockProducts(threshold?: number) {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        stockQuantity: {
          lte: threshold || 5,
        },
      },
      include: {
        category: true,
        brand: true,
      },
      orderBy: { stockQuantity: 'asc' },
    });
  }

  // === PRODUCT IMAGE MANAGEMENT ===

  async getProductImages(productId: number) {
    return this.prisma.productImage.findMany({
      where: { productId },
      include: { 
        fileUpload: true,
        product: true 
      },
      orderBy: [
        { isDefault: 'desc' },
        { sortOrder: 'asc' }
      ],
    });
  }

  async createProductImage(data: {
    productId: number;
    fileUploadId: number;
    alt?: string;
    title?: string;
    sortOrder?: number;
    isDefault?: boolean;
  }) {
    // If this is set as default, unset other defaults for this product
    if (data.isDefault) {
      await this.prisma.productImage.updateMany({
        where: { productId: data.productId },
        data: { isDefault: false },
      });
    }

    return this.prisma.productImage.create({
      data: {
        ...data,
        sortOrder: data.sortOrder ?? 0,
        isDefault: data.isDefault ?? false,
      },
      include: { 
        fileUpload: true,
        product: true 
      },
    });
  }

  async updateProductImage(
    id: number,
    data: {
      alt?: string;
      title?: string;
      sortOrder?: number;
      isDefault?: boolean;
    },
  ) {
    const image = await this.prisma.productImage.findUnique({
      where: { id },
      select: { productId: true },
    });

    if (!image) {
      throw new Error('Product image not found');
    }

    // If this is set as default, unset other defaults for this product
    if (data.isDefault) {
      await this.prisma.productImage.updateMany({
        where: { productId: image.productId },
        data: { isDefault: false },
      });
    }

    return this.prisma.productImage.update({
      where: { id },
      data,
      include: { 
        fileUpload: true,
        product: true 
      },
    });
  }

  async deleteProductImage(id: number) {
    return this.prisma.productImage.delete({
      where: { id },
    });
  }

  async setDefaultProductImage(imageId: number) {
    const image = await this.prisma.productImage.findUnique({
      where: { id: imageId },
      select: { productId: true },
    });

    if (!image) {
      throw new Error('Product image not found');
    }

    // Unset all defaults for this product
    await this.prisma.productImage.updateMany({
      where: { productId: image.productId },
      data: { isDefault: false },
    });

    // Set this image as default
    return this.prisma.productImage.update({
      where: { id: imageId },
      data: { isDefault: true },
      include: { 
        fileUpload: true,
        product: true 
      },
    });
  }

  // === PRODUCT ATTRIBUTE MANAGEMENT ===

  async getProductAttributes(productId: number) {
    return this.prisma.productAttribute.findMany({
      where: { productId },
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
  }

  async createProductAttribute(data: {
    productId: number;
    name: string;
    nameEn: string;
    options: any;
    isRequired?: boolean;
    isVariant?: boolean;
    attributeType?: string;
    sortOrder?: number;
  }) {
    return this.prisma.productAttribute.create({
      data: {
        ...data,
        isRequired: data.isRequired ?? false,
        isVariant: data.isVariant ?? true,
        attributeType: data.attributeType as any ?? 'TEXT',
        sortOrder: data.sortOrder ?? 0,
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
  }

  async updateProductAttribute(
    id: number,
    data: {
      name?: string;
      nameEn?: string;
      options?: any;
      isRequired?: boolean;
      isVariant?: boolean;
      attributeType?: string;
      sortOrder?: number;
    },
  ) {
    return this.prisma.productAttribute.update({
      where: { id },
      data: {
        ...data,
        attributeType: data.attributeType as any,
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
  }

  async deleteProductAttribute(id: number) {
    return this.prisma.productAttribute.delete({
      where: { id },
    });
  }

  // === PRODUCT VARIATION MANAGEMENT ===

  async getProductVariations(productId: number) {
    return this.prisma.productVariation.findMany({
      where: { productId },
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
  }

  async createProductVariation(data: {
    productId: number;
    sku?: string;
    price: number;
    comparePrice?: number;
    stockQuantity?: number;
    isActive?: boolean;
    attributes: Array<{
      attributeId: number;
      value: string;
      valueEn?: string;
      colorHex?: string;
      sortOrder?: number;
    }>;
  }) {
    return this.prisma.$transaction(async (tx) => {
      // Create the variation
      const variation = await tx.productVariation.create({
        data: {
          productId: data.productId,
          sku: data.sku,
          price: data.price,
          comparePrice: data.comparePrice,
          stockQuantity: data.stockQuantity ?? 0,
          isActive: data.isActive ?? true,
        },
      });

      // Create variation attributes
      await tx.productVariationAttribute.createMany({
        data: data.attributes.map((attr) => ({
          variationId: variation.id,
          attributeId: attr.attributeId,
          value: attr.value,
          valueEn: attr.valueEn,
          colorHex: attr.colorHex,
          sortOrder: attr.sortOrder ?? 0,
        })),
      });

      // Return variation with attributes
      return tx.productVariation.findUnique({
        where: { id: variation.id },
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
    });
  }

  async updateProductVariation(
    id: number,
    data: {
      sku?: string;
      price?: number;
      comparePrice?: number;
      stockQuantity?: number;
      isActive?: boolean;
      attributes?: Array<{
        id?: number;
        attributeId?: number;
        value?: string;
        valueEn?: string;
        colorHex?: string;
        sortOrder?: number;
      }>;
    },
  ) {
    return this.prisma.$transaction(async (tx) => {
      // Update the variation
      const variation = await tx.productVariation.update({
        where: { id },
        data: {
          sku: data.sku,
          price: data.price,
          comparePrice: data.comparePrice,
          stockQuantity: data.stockQuantity,
          isActive: data.isActive,
        },
      });

      // Handle attributes if provided
      if (data.attributes) {
        // Delete existing attributes
        await tx.productVariationAttribute.deleteMany({
          where: { variationId: id },
        });

        // Create new attributes
        await tx.productVariationAttribute.createMany({
          data: data.attributes
            .filter(attr => attr.attributeId && attr.value)
            .map((attr) => ({
              variationId: id,
              attributeId: attr.attributeId!,
              value: attr.value!,
              valueEn: attr.valueEn,
              colorHex: attr.colorHex,
              sortOrder: attr.sortOrder ?? 0,
            })),
        });
      }

      // Return variation with attributes
      return tx.productVariation.findUnique({
        where: { id },
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
    });
  }

  async deleteProductVariation(id: number) {
    return this.prisma.productVariation.delete({
      where: { id },
    });
  }

  async updateVariationStock(variationId: number, stockQuantity: number) {
    return this.prisma.productVariation.update({
      where: { id: variationId },
      data: { stockQuantity },
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
  }

  // Enhanced product queries that include images, attributes, and variations
  async findProductByIdWithDetails(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
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

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async findAllProductsWithDetails(limit = 20, offset = 0) {
    return this.prisma.product.findMany({
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
          take: 1 // Only get the main image for listing
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
          take: 1 // Only get the first variation for listing
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }
}
