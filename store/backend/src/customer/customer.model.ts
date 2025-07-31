import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class CustomerAddress {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  customerId: number;

  @Field()
  name: string;

  @Field()
  phoneNumber: string;

  @Field()
  addressLine1: string;

  @Field({ nullable: true })
  addressLine2?: string;

  @Field(() => Int, { nullable: true })
  cityId?: number;

  @Field(() => Int, { nullable: true })
  regionId?: number;

  @Field({ nullable: true })
  postalCode?: string;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  isDefault: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class WishlistItem {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  customerId: number;

  @Field(() => Int)
  productId: number;

  @Field()
  addedAt: Date;
}

@ObjectType()
export class CustomerProfile {
  @Field(() => Int)
  userId: number;

  @Field(() => Int, { nullable: true })
  defaultAddressId?: number;

  @Field()
  language: string;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [CustomerAddress])
  addresses: CustomerAddress[];

  @Field(() => CustomerAddress, { nullable: true })
  defaultAddress?: CustomerAddress;

  @Field(() => [WishlistItem])
  wishlist: WishlistItem[];
}
