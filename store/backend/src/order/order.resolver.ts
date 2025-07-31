import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order, OrderStats, OrderStatus, PaymentStatus } from './order.model';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private orderService: OrderService) {}

  @Query(() => [Order], { name: 'orders' })
  findAllOrders(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 })
    limit: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
    offset: number,
    @Args('status', { type: () => OrderStatus, nullable: true })
    status?: OrderStatus,
  ) {
    return this.orderService.findAllOrders(limit, offset, status);
  }

  @Query(() => Order, { name: 'order', nullable: true })
  findOrderById(@Args('id', { type: () => Int }) id: number) {
    return this.orderService.findOrderById(id);
  }

  @Query(() => [Order], { name: 'searchOrders' })
  searchOrders(
    @Args('searchTerm') searchTerm: string,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 })
    limit: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
    offset: number,
  ) {
    return this.orderService.searchOrders(searchTerm, limit, offset);
  }

  @Query(() => [Order], { name: 'ordersByDateRange' })
  getOrdersByDateRange(
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
  ) {
    return this.orderService.getOrdersByDateRange(startDate, endDate);
  }

  @Query(() => OrderStats, { name: 'orderStats' })
  getOrderStats() {
    return this.orderService.getOrderStats();
  }

  @Mutation(() => Order)
  updateOrderStatus(
    @Args('id', { type: () => Int }) id: number,
    @Args('status', { type: () => OrderStatus }) status: OrderStatus,
    @Args('note', { nullable: true }) note?: string,
    @Args('updatedById', { type: () => Int, nullable: true })
    updatedById?: number,
  ) {
    return this.orderService.updateOrderStatus(id, status, updatedById);
  }

  @Mutation(() => Order)
  updatePaymentStatus(
    @Args('id', { type: () => Int }) id: number,
    @Args('paymentStatus', { type: () => PaymentStatus })
    paymentStatus: PaymentStatus,
  ) {
    return this.orderService.updatePaymentStatus(id, paymentStatus);
  }
}
