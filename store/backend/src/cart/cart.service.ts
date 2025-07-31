import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cart, CartItem, CartSummary } from './cart.model';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(customerId: number): Promise<Cart> {
    let cart = await this.prisma.cart.findUnique({
      where: { customerId },
      include: {
        items: {
          include: {
            product: {
              include: {
                brand: true,
                category: true,
                vendor: true,
              },
            },
            variation: true,
          },
        },
      },
    });

    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = await this.prisma.cart.create({
        data: { customerId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  brand: true,
                  category: true,
                  vendor: true,
                },
              },
              variation: true,
            },
          },
        },
      });
    }

    return this.transformCart(cart);
  }

  async addToCart(
    customerId: number,
    productId: number,
    quantity: number = 1,
    variationId?: number,
  ): Promise<Cart> {
    // Verify product exists and is active
    const product = await this.prisma.product.findFirst({
      where: { id: productId, isActive: true, isPublished: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found or not available');
    }

    // Check stock
    const stockQuantity = variationId
      ? (
          await this.prisma.productVariation.findUnique({
            where: { id: variationId },
          })
        )?.stockQuantity || 0
      : product.stockQuantity;

    if (stockQuantity < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    // Get or create cart
    let cart = await this.prisma.cart.findUnique({
      where: { customerId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { customerId },
      });
    }

    // Check if item already exists in cart
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      if (stockQuantity < newQuantity) {
        throw new BadRequestException(
          'Insufficient stock for requested quantity',
        );
      }

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Add new item
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variationId,
          quantity,
        },
      });
    }

    return this.getCart(customerId);
  }

  async updateCartItem(
    customerId: number,
    cartItemId: number,
    quantity: number,
  ): Promise<Cart> {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: { customerId },
      },
      include: {
        product: true,
        variation: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await this.prisma.cartItem.delete({
        where: { id: cartItemId },
      });
    } else {
      // Check stock
      const stockQuantity = cartItem.variationId
        ? cartItem.variation?.stockQuantity || 0
        : cartItem.product.stockQuantity;

      if (stockQuantity < quantity) {
        throw new BadRequestException('Insufficient stock');
      }

      await this.prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
      });
    }

    return this.getCart(customerId);
  }

  async removeFromCart(customerId: number, cartItemId: number): Promise<Cart> {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: { customerId },
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return this.getCart(customerId);
  }

  async clearCart(customerId: number): Promise<Cart> {
    const cart = await this.prisma.cart.findUnique({
      where: { customerId },
    });

    if (cart) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return this.getCart(customerId);
  }

  async getCartSummary(customerId: number): Promise<CartSummary> {
    const cart = await this.getCart(customerId);
    return {
      itemCount: cart.itemCount,
      subtotal: cart.total,
      total: cart.total,
    };
  }

  private transformCart(cart: any): Cart {
    const items = cart.items.map((item: any) => ({
      ...item,
      itemTotal: this.calculateItemTotal(item),
    }));

    const total = items.reduce(
      (sum: number, item: any) => sum + item.itemTotal,
      0,
    );
    const itemCount = items.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0,
    );

    return {
      ...cart,
      items,
      total,
      itemCount,
    };
  }

  private calculateItemTotal(item: any): number {
    const price = item.variationId ? item.variation?.price : item.product.price;
    return parseFloat(price?.toString() || '0') * item.quantity;
  }
}
