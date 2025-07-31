import { Resolver, Query } from '@nestjs/graphql';
import { AnalyticsService } from './analytics.service';
import {
  DashboardMetrics,
  SalesAnalytics,
  PerformanceMetrics,
} from './analytics.model';

@Resolver()
export class AnalyticsResolver {
  constructor(private analyticsService: AnalyticsService) {}

  @Query(() => DashboardMetrics, { name: 'dashboardMetrics' })
  getDashboardMetrics() {
    return this.analyticsService.getDashboardMetrics();
  }

  @Query(() => SalesAnalytics, { name: 'salesAnalytics' })
  getSalesAnalytics() {
    return this.analyticsService.getSalesAnalytics();
  }

  @Query(() => PerformanceMetrics, { name: 'performanceMetrics' })
  getPerformanceMetrics() {
    return this.analyticsService.getPerformanceMetrics();
  }
}
