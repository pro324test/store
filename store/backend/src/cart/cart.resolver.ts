import { Resolver, Query, Mutation, Args, Context, Int } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart, CartSummary } from './cart.model';
import {
  AddToCartInput,
  UpdateCartItemInput,
  RemoveFromCartInput,
} from './cart.dto';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private cartService: CartService) {}

  @Query(() => Cart, { name: 'cart' })
  async getCart(
    @Args('customerId', { type: () => Int }) customerId: number,
  ): Promise<Cart> {
    return this.cartService.getCart(customerId);
  }

  @Query(() => CartSummary, { name: 'cartSummary' })
  async getCartSummary(
    @Args('customerId', { type: () => Int }) customerId: number,
  ): Promise<CartSummary> {
    return this.cartService.getCartSummary(customerId);
  }

  @Mutation(() => Cart)
  async addToCart(
    @Args('input') input: AddToCartInput,
    @Args('customerId', { type: () => Int }) customerId: number,
  ): Promise<Cart> {
    return this.cartService.addToCart(
      customerId,
      input.productId,
      input.quantity,
      input.variationId,
    );
  }

  @Mutation(() => Cart)
  async updateCartItem(
    @Args('input') input: UpdateCartItemInput,
    @Args('customerId', { type: () => Int }) customerId: number,
  ): Promise<Cart> {
    return this.cartService.updateCartItem(
      customerId,
      input.cartItemId,
      input.quantity,
    );
  }

  @Mutation(() => Cart)
  async removeFromCart(
    @Args('input') input: RemoveFromCartInput,
    @Args('customerId', { type: () => Int }) customerId: number,
  ): Promise<Cart> {
    return this.cartService.removeFromCart(customerId, input.cartItemId);
  }

  @Mutation(() => Cart)
  async clearCart(
    @Args('customerId', { type: () => Int }) customerId: number,
  ): Promise<Cart> {
    return this.cartService.clearCart(customerId);
  }
}
