import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ReviewService } from './review.service';
import { ProductReview, ProductRatingsSummary } from './review.model';

@Resolver(() => ProductReview)
export class ReviewResolver {
  constructor(private reviewService: ReviewService) {}

  @Query(() => [ProductReview], { name: 'productReviews' })
  findReviewsByProduct(
    @Args('productId', { type: () => Int }) productId: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 20 })
    limit: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
    offset: number,
  ) {
    return this.reviewService.findReviewsByProduct(productId, limit, offset);
  }

  @Query(() => [ProductReview], { name: 'customerReviews' })
  findReviewsByCustomer(
    @Args('customerId', { type: () => Int }) customerId: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 20 })
    limit: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
    offset: number,
  ) {
    return this.reviewService.findReviewsByCustomer(customerId, limit, offset);
  }

  @Query(() => ProductReview, { name: 'review', nullable: true })
  findReviewById(@Args('id', { type: () => Int }) id: number) {
    return this.reviewService.findReviewById(id);
  }

  @Query(() => ProductRatingsSummary, { name: 'productRatingsSummary' })
  getProductRatingsSummary(
    @Args('productId', { type: () => Int }) productId: number,
  ) {
    return this.reviewService.getProductRatingsSummary(productId);
  }

  @Query(() => [ProductReview], { name: 'pendingReviews' })
  getPendingReviews(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 })
    limit: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
    offset: number,
  ) {
    return this.reviewService.getPendingReviews(limit, offset);
  }

  @Query(() => Boolean, { name: 'canCustomerReviewProduct' })
  canCustomerReviewProduct(
    @Args('customerId', { type: () => Int }) customerId: number,
    @Args('productId', { type: () => Int }) productId: number,
  ) {
    return this.reviewService.canCustomerReviewProduct(customerId, productId);
  }

  @Mutation(() => ProductReview)
  createReview(
    @Args('productId', { type: () => Int }) productId: number,
    @Args('customerId', { type: () => Int }) customerId: number,
    @Args('rating', { type: () => Int }) rating: number,
    @Args('orderId', { type: () => Int, nullable: true }) orderId?: number,
    @Args('title', { nullable: true }) title?: string,
    @Args('comment', { nullable: true }) comment?: string,
  ) {
    return this.reviewService.createReview({
      productId,
      customerId,
      orderId,
      rating,
      title,
      comment,
    });
  }

  @Mutation(() => ProductReview)
  updateReview(
    @Args('id', { type: () => Int }) id: number,
    @Args('rating', { type: () => Int, nullable: true }) rating?: number,
    @Args('title', { nullable: true }) title?: string,
    @Args('comment', { nullable: true }) comment?: string,
    @Args('status', { nullable: true }) status?: string,
  ) {
    return this.reviewService.updateReview(id, {
      rating,
      title,
      comment,
      status,
    });
  }

  @Mutation(() => Boolean)
  async deleteReview(@Args('id', { type: () => Int }) id: number) {
    await this.reviewService.deleteReview(id);
    return true;
  }

  @Mutation(() => ProductReview)
  approveReview(@Args('id', { type: () => Int }) id: number) {
    return this.reviewService.approveReview(id);
  }

  @Mutation(() => ProductReview)
  rejectReview(@Args('id', { type: () => Int }) id: number) {
    return this.reviewService.rejectReview(id);
  }
}
