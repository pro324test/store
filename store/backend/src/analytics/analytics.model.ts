import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class DashboardMetrics {
  @Field(() => Int)
  totalUsers: number;

  @Field(() => Int)
  activeUsers: number;

  @Field(() => Int)
  totalVendors: number;

  @Field(() => Int)
  activeVendors: number;

  @Field(() => Int)
  totalCustomers: number;

  @Field(() => Int)
  totalProducts: number;

  @Field(() => Int)
  activeProducts: number;

  @Field(() => Int)
  featuredProducts: number;

  @Field(() => Int)
  totalCategories: number;

  @Field(() => Int)
  activeCategories: number;

  @Field(() => Int)
  totalBrands: number;

  @Field(() => Int)
  activeBrands: number;

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
  monthlyRevenue: number;

  @Field(() => Float)
  todayRevenue: number;
}

@ObjectType()
export class ChartDataPoint {
  @Field()
  label: string;

  @Field(() => Float)
  value: number;

  @Field({ nullable: true })
  date?: string;
}

@ObjectType()
export class SalesAnalytics {
  @Field(() => [ChartDataPoint])
  dailySales: ChartDataPoint[];

  @Field(() => [ChartDataPoint])
  monthlySales: ChartDataPoint[];

  @Field(() => [ChartDataPoint])
  categoryBreakdown: ChartDataPoint[];

  @Field(() => [ChartDataPoint])
  vendorPerformance: ChartDataPoint[];
}

@ObjectType()
export class TopPerformingItem {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Float)
  value: number;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class PerformanceMetrics {
  @Field(() => [TopPerformingItem])
  topProducts: TopPerformingItem[];

  @Field(() => [TopPerformingItem])
  topCategories: TopPerformingItem[];

  @Field(() => [TopPerformingItem])
  topVendors: TopPerformingItem[];

  @Field(() => [TopPerformingItem])
  topCustomers: TopPerformingItem[];
}
