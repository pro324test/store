import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ProductReview {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  customerId: number;

  @Field(() => Int, { nullable: true })
  orderId?: number;

  @Field(() => Int)
  rating: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  comment?: string;

  @Field()
  isVerifiedPurchase: boolean;

  @Field()
  status: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class ProductRatingsSummary {
  @Field(() => Int)
  productId: number;

  @Field()
  averageRating: number;

  @Field(() => Int)
  totalReviews: number;

  @Field(() => [RatingBreakdown])
  breakdown: RatingBreakdown[];
}

@ObjectType()
export class RatingBreakdown {
  @Field(() => Int)
  stars: number;

  @Field(() => Int)
  count: number;

  @Field()
  percentage: number;
}
