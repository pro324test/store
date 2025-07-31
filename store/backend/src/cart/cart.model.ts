import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Product } from '../product/product.model';
import { User } from '../user/user.model';

@ObjectType()
export class Cart {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  customerId: number;

  @Field(() => [CartItem])
  items: CartItem[];

  @Field(() => Float)
  total: number;

  @Field(() => Int)
  itemCount: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class CartItem {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  cartId: number;

  @Field(() => Int)
  productId: number;

  @Field(() => Int, { nullable: true })
  variationId?: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => Product)
  product: Product;

  @Field(() => Float)
  itemTotal: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class CartSummary {
  @Field(() => Int)
  itemCount: number;

  @Field(() => Float)
  subtotal: number;

  @Field(() => Float)
  total: number;
}
