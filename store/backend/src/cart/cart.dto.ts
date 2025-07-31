import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class AddToCartInput {
  @Field(() => Int)
  productId: number;

  @Field(() => Int, { defaultValue: 1 })
  quantity: number;

  @Field(() => Int, { nullable: true })
  variationId?: number;
}

@InputType()
export class UpdateCartItemInput {
  @Field(() => Int)
  cartItemId: number;

  @Field(() => Int)
  quantity: number;
}

@InputType()
export class RemoveFromCartInput {
  @Field(() => Int)
  cartItemId: number;
}
