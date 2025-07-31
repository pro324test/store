import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CustomerService } from './customer.service';
import {
  CustomerProfile,
  CustomerAddress,
  WishlistItem,
} from './customer.model';

@Resolver(() => CustomerProfile)
export class CustomerResolver {
  constructor(private customerService: CustomerService) {}

  // Customer Profile
  @Query(() => CustomerProfile, { name: 'customerProfile', nullable: true })
  findCustomerProfile(@Args('userId', { type: () => Int }) userId: number) {
    return this.customerService.findCustomerProfile(userId);
  }

  @Mutation(() => CustomerProfile)
  createCustomerProfile(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('language', { nullable: true, defaultValue: 'ar' }) language: string,
  ) {
    return this.customerService.createCustomerProfile(userId, language);
  }

  @Mutation(() => CustomerProfile)
  updateCustomerProfile(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('language', { nullable: true }) language?: string,
    @Args('defaultAddressId', { type: () => Int, nullable: true })
    defaultAddressId?: number,
  ) {
    return this.customerService.updateCustomerProfile(userId, {
      language,
      defaultAddressId,
    });
  }

  // Customer Addresses
  @Query(() => [CustomerAddress], { name: 'customerAddresses' })
  findCustomerAddresses(
    @Args('customerId', { type: () => Int }) customerId: number,
  ) {
    return this.customerService.findCustomerAddresses(customerId);
  }

  @Query(() => CustomerAddress, { name: 'customerAddress', nullable: true })
  findAddressById(@Args('id', { type: () => Int }) id: number) {
    return this.customerService.findAddressById(id);
  }

  @Mutation(() => CustomerAddress)
  createCustomerAddress(
    @Args('customerId', { type: () => Int }) customerId: number,
    @Args('name') name: string,
    @Args('phoneNumber') phoneNumber: string,
    @Args('addressLine1') addressLine1: string,
    @Args('addressLine2', { nullable: true }) addressLine2?: string,
    @Args('cityId', { type: () => Int, nullable: true }) cityId?: number,
    @Args('regionId', { type: () => Int, nullable: true }) regionId?: number,
    @Args('postalCode', { nullable: true }) postalCode?: string,
    @Args('notes', { nullable: true }) notes?: string,
    @Args('isDefault', { nullable: true, defaultValue: false })
    isDefault?: boolean,
  ) {
    return this.customerService.createAddress({
      customerId,
      name,
      phoneNumber,
      addressLine1,
      addressLine2,
      cityId,
      regionId,
      postalCode,
      notes,
      isDefault,
    });
  }

  @Mutation(() => CustomerAddress)
  updateCustomerAddress(
    @Args('id', { type: () => Int }) id: number,
    @Args('name', { nullable: true }) name?: string,
    @Args('phoneNumber', { nullable: true }) phoneNumber?: string,
    @Args('addressLine1', { nullable: true }) addressLine1?: string,
    @Args('addressLine2', { nullable: true }) addressLine2?: string,
    @Args('cityId', { type: () => Int, nullable: true }) cityId?: number,
    @Args('regionId', { type: () => Int, nullable: true }) regionId?: number,
    @Args('postalCode', { nullable: true }) postalCode?: string,
    @Args('notes', { nullable: true }) notes?: string,
    @Args('isDefault', { nullable: true }) isDefault?: boolean,
  ) {
    return this.customerService.updateAddress(id, {
      name,
      phoneNumber,
      addressLine1,
      addressLine2,
      cityId,
      regionId,
      postalCode,
      notes,
      isDefault,
    });
  }

  @Mutation(() => Boolean)
  async deleteCustomerAddress(@Args('id', { type: () => Int }) id: number) {
    await this.customerService.deleteAddress(id);
    return true;
  }

  // Wishlist
  @Query(() => [WishlistItem], { name: 'customerWishlist' })
  getCustomerWishlist(
    @Args('customerId', { type: () => Int }) customerId: number,
  ) {
    return this.customerService.getCustomerWishlist(customerId);
  }

  @Query(() => Boolean, { name: 'isProductInWishlist' })
  isProductInWishlist(
    @Args('customerId', { type: () => Int }) customerId: number,
    @Args('productId', { type: () => Int }) productId: number,
  ) {
    return this.customerService.isProductInWishlist(customerId, productId);
  }

  @Mutation(() => WishlistItem)
  addToWishlist(
    @Args('customerId', { type: () => Int }) customerId: number,
    @Args('productId', { type: () => Int }) productId: number,
  ) {
    return this.customerService.addToWishlist(customerId, productId);
  }

  @Mutation(() => Boolean)
  async removeFromWishlist(
    @Args('customerId', { type: () => Int }) customerId: number,
    @Args('productId', { type: () => Int }) productId: number,
  ) {
    await this.customerService.removeFromWishlist(customerId, productId);
    return true;
  }

  @Mutation(() => Boolean)
  async clearWishlist(
    @Args('customerId', { type: () => Int }) customerId: number,
  ) {
    await this.customerService.clearWishlist(customerId);
    return true;
  }
}
