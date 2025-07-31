import {
  ObjectType,
  Field,
  Int,
  Float,
  registerEnumType,
} from '@nestjs/graphql';

// Define GraphQL enums
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  PARTIAL = 'PARTIAL',
  CANCELLED = 'CANCELLED',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: 'The status of an order',
});

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
  description: 'The payment status of an order',
});

@ObjectType()
export class CustomerInfo {
  @Field(() => Int)
  id: number;

  @Field()
  fullName: string;

  @Field({ nullable: true })
  email?: string;

  @Field()
  phoneNumber: string;
}

@ObjectType()
export class VendorInfo {
  @Field(() => Int)
  id: number;

  @Field()
  storeName: string;

  @Field({ nullable: true })
  storeNameEn?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phoneNumber?: string;
}

@ObjectType()
export class OrderItem {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  orderId: number;

  @Field(() => Int)
  productId: number;

  @Field(() => Int, { nullable: true })
  variationId?: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  sku?: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  subtotal: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class Order {
  @Field(() => Int)
  id: number;

  @Field()
  orderNumber: string;

  @Field(() => Int)
  customerId: number;

  @Field(() => Int)
  vendorId: number;

  @Field(() => Float)
  subtotal: number;

  @Field(() => Float)
  shipping: number;

  @Field(() => Float)
  tax: number;

  @Field(() => Float)
  discount: number;

  @Field(() => Float)
  total: number;

  @Field({ nullable: true })
  couponCode?: string;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => PaymentStatus)
  paymentStatus: PaymentStatus;

  @Field({ nullable: true })
  paymentMethod?: string;

  @Field({ nullable: true })
  shippingMethod?: string;

  @Field({ nullable: true })
  trackingNumber?: string;

  @Field({ nullable: true })
  customerNotes?: string;

  @Field({ nullable: true })
  vendorNotes?: string;

  @Field()
  placedAt: Date;

  @Field({ nullable: true })
  paidAt?: Date;

  @Field({ nullable: true })
  processedAt?: Date;

  @Field({ nullable: true })
  shippedAt?: Date;

  @Field({ nullable: true })
  deliveredAt?: Date;

  @Field({ nullable: true })
  cancelledAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [OrderItem])
  items: OrderItem[];

  // Customer and vendor info
  @Field(() => CustomerInfo, { nullable: true })
  customer?: CustomerInfo;

  @Field(() => VendorInfo, { nullable: true })
  vendor?: VendorInfo;
}

@ObjectType()
export class OrderSummary {
  @Field(() => Int)
  totalOrders: number;

  @Field(() => Int)
  pendingOrders: number;

  @Field(() => Int)
  processingOrders: number;

  @Field(() => Int)
  completedOrders: number;

  @Field(() => Int)
  cancelledOrders: number;

  @Field(() => Float)
  totalRevenue: number;

  @Field(() => Float)
  todayRevenue: number;

  @Field(() => Float)
  monthlyRevenue: number;
}

@ObjectType()
export class OrderStats {
  @Field(() => OrderSummary)
  summary: OrderSummary;

  @Field(() => [Order])
  recentOrders: Order[];
}
