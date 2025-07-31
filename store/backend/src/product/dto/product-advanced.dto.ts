import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';
import { AttributeType } from '../product.model';

@InputType()
export class CreateProductImageInput {
  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  fileUploadId: number;

  @Field({ nullable: true })
  alt?: string;

  @Field({ nullable: true })
  title?: string;

  @Field(() => Int, { defaultValue: 0 })
  sortOrder: number;

  @Field({ defaultValue: false })
  isDefault: boolean;
}

@InputType()
export class UpdateProductImageInput {
  @Field({ nullable: true })
  alt?: string;

  @Field({ nullable: true })
  title?: string;

  @Field(() => Int, { nullable: true })
  sortOrder?: number;

  @Field({ nullable: true })
  isDefault?: boolean;
}

@InputType()
export class CreateProductAttributeInput {
  @Field(() => Int)
  productId: number;

  @Field()
  name: string;

  @Field()
  nameEn: string;

  @Field(() => GraphQLJSON)
  options: any;

  @Field({ defaultValue: false })
  isRequired: boolean;

  @Field({ defaultValue: true })
  isVariant: boolean;

  @Field(() => AttributeType, { defaultValue: AttributeType.TEXT })
  attributeType: AttributeType;

  @Field(() => Int, { defaultValue: 0 })
  sortOrder: number;
}

@InputType()
export class UpdateProductAttributeInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  nameEn?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  options?: any;

  @Field({ nullable: true })
  isRequired?: boolean;

  @Field({ nullable: true })
  isVariant?: boolean;

  @Field(() => AttributeType, { nullable: true })
  attributeType?: AttributeType;

  @Field(() => Int, { nullable: true })
  sortOrder?: number;
}

@InputType()
export class CreateProductVariationInput {
  @Field(() => Int)
  productId: number;

  @Field({ nullable: true })
  sku?: string;

  @Field(() => Float)
  price: number;

  @Field(() => Float, { nullable: true })
  comparePrice?: number;

  @Field(() => Int, { defaultValue: 0 })
  stockQuantity: number;

  @Field({ defaultValue: true })
  isActive: boolean;

  @Field(() => [CreateVariationAttributeInput])
  attributes: CreateVariationAttributeInput[];
}

@InputType()
export class UpdateProductVariationInput {
  @Field({ nullable: true })
  sku?: string;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field(() => Float, { nullable: true })
  comparePrice?: number;

  @Field(() => Int, { nullable: true })
  stockQuantity?: number;

  @Field({ nullable: true })
  isActive?: boolean;

  @Field(() => [UpdateVariationAttributeInput], { nullable: true })
  attributes?: UpdateVariationAttributeInput[];
}

@InputType()
export class CreateVariationAttributeInput {
  @Field(() => Int)
  attributeId: number;

  @Field()
  value: string;

  @Field({ nullable: true })
  valueEn?: string;

  @Field({ nullable: true })
  colorHex?: string;

  @Field(() => Int, { defaultValue: 0 })
  sortOrder: number;
}

@InputType()
export class UpdateVariationAttributeInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  attributeId?: number;

  @Field({ nullable: true })
  value?: string;

  @Field({ nullable: true })
  valueEn?: string;

  @Field({ nullable: true })
  colorHex?: string;

  @Field(() => Int, { nullable: true })
  sortOrder?: number;
}