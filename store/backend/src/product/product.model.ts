import { ObjectType, Field, Int, Float, registerEnumType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

// Register AttributeType enum for GraphQL
export enum AttributeType {
  TEXT = 'TEXT',
  COLOR = 'COLOR', 
  SIZE = 'SIZE',
  MATERIAL = 'MATERIAL',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
}

registerEnumType(AttributeType, {
  name: 'AttributeType',
  description: 'The type of product attribute',
});

@ObjectType()
export class Category {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  nameEn: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  descriptionEn?: string;

  @Field()
  slug: string;

  @Field()
  isActive: boolean;

  @Field(() => Int)
  sortOrder: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [Subcategory])
  subcategories: Subcategory[];
}

@ObjectType()
export class Subcategory {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  categoryId: number;

  @Field()
  name: string;

  @Field()
  nameEn: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  descriptionEn?: string;

  @Field()
  slug: string;

  @Field()
  isActive: boolean;

  @Field(() => Int)
  sortOrder: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Category)
  category: Category;
}

@ObjectType()
export class Brand {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  nameEn: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  descriptionEn?: string;

  @Field()
  slug: string;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class Product {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  vendorId: number;

  @Field(() => Int)
  categoryId: number;

  @Field(() => Int, { nullable: true })
  subcategoryId?: number;

  @Field(() => Int, { nullable: true })
  brandId?: number;

  @Field()
  name: string;

  @Field()
  nameEn: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  sku?: string;

  @Field({ nullable: true })
  barcode?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  descriptionEn?: string;

  @Field({ nullable: true })
  shortDesc?: string;

  @Field({ nullable: true })
  shortDescEn?: string;

  @Field(() => Float)
  price: number;

  @Field(() => Float, { nullable: true })
  comparePrice?: number;

  @Field(() => Float)
  costPrice: number;

  @Field(() => Int)
  stockQuantity: number;

  @Field(() => Int, { nullable: true })
  lowStockAlert?: number;

  @Field()
  trackInventory: boolean;

  @Field()
  isActive: boolean;

  @Field()
  isPublished: boolean;

  @Field()
  isFeatured: boolean;

  @Field({ nullable: true })
  metaTitle?: string;

  @Field({ nullable: true })
  metaDescription?: string;

  @Field({ nullable: true })
  metaKeywords?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Category)
  category: Category;

  @Field(() => Subcategory, { nullable: true })
  subcategory?: Subcategory;

  @Field(() => Brand, { nullable: true })
  brand?: Brand;

  @Field(() => [ProductImage])
  images: ProductImage[];

  @Field(() => [ProductAttribute])
  attributes: ProductAttribute[];

  @Field(() => [ProductVariation])
  variations: ProductVariation[];
}

@ObjectType()
export class FileUpload {
  @Field(() => Int)
  id: number;

  @Field()
  originalName: string;

  @Field()
  filename: string;

  @Field()
  path: string;

  @Field()
  mimetype: string;

  @Field(() => Int)
  size: number;

  @Field()
  isPublic: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class ProductImage {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  fileUploadId: number;

  @Field({ nullable: true })
  alt?: string;

  @Field({ nullable: true })
  title?: string;

  @Field(() => Int)
  sortOrder: number;

  @Field()
  isDefault: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Product)
  product: Product;

  @Field(() => FileUpload)
  fileUpload: FileUpload;
}

@ObjectType()
export class ProductAttribute {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  productId: number;

  @Field()
  name: string;

  @Field()
  nameEn: string;

  @Field(() => GraphQLJSON)
  options: any;

  @Field()
  isRequired: boolean;

  @Field()
  isVariant: boolean;

  @Field(() => AttributeType)
  attributeType: AttributeType;

  @Field(() => Int)
  sortOrder: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Product)
  product: Product;

  @Field(() => [ProductVariationAttribute])
  variationAttributes: ProductVariationAttribute[];
}

@ObjectType()
export class ProductVariation {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  productId: number;

  @Field({ nullable: true })
  sku?: string;

  @Field(() => Float)
  price: number;

  @Field(() => Float, { nullable: true })
  comparePrice?: number;

  @Field(() => Int)
  stockQuantity: number;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Product)
  product: Product;

  @Field(() => [ProductVariationAttribute])
  attributes: ProductVariationAttribute[];
}

@ObjectType()
export class ProductVariationAttribute {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  variationId: number;

  @Field(() => Int)
  attributeId: number;

  @Field()
  value: string;

  @Field({ nullable: true })
  valueEn?: string;

  @Field({ nullable: true })
  colorHex?: string;

  @Field(() => Int)
  sortOrder: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => ProductVariation)
  variation: ProductVariation;

  @Field(() => ProductAttribute)
  attribute: ProductAttribute;
}
