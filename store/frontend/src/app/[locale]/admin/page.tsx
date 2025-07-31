'use client';

// Force dynamic rendering - disable SSR/SSG
export const dynamic = 'force-dynamic';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { AdminLayout } from '@/components/admin/admin-layout';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Role } from '@/types/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, Package, TrendingUp, Settings, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_STATS } from '@/lib/graphql/admin';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalVendors: number;
  activeUsersCount: number;
  pendingOrdersCount: number;
  userGrowth: number;
  productGrowth: number;
  orderGrowth: number;
  systemHealth: {
    status: string;
    message: string;
    details?: string;
  };
  recentActivity: Array<{
    id: number;
    type: string;
    description: string;
    storeName?: string;
    amount?: string;
    createdAt: string;
    status: string;
  }>;
}

function AdminDashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
  const { data, loading, error } = useQuery<{ dashboardStats: DashboardStats }>(GET_DASHBOARD_STATS, {
    errorPolicy: 'all',
  });

  // Check if user has admin role
  const isAdmin = user?.roles.some(role => role.role === Role.SYSTEM_STAFF && role.isActive);

  // If user is not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <Shield className="w-16 h-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold text-red-600">
            Access Denied
          </h1>
          <p className="text-muted-foreground">
            You don&apos;t have permission to access the admin dashboard.
          </p>
          <Button onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const stats = data?.dashboardStats;

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'WARNING':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'ERROR':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Settings className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return 'text-green-600';
      case 'WARNING':
        return 'text-yellow-600';
      case 'ERROR':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatGrowth = (growth: number) => {
    const sign = growth >= 0 ? '+' : '';
    return `${sign}${growth}% from last month`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'DELIVERED':
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout 
      title="Admin Dashboard" 
      description="System overview and management tools"
    >
      <div className="space-y-6">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading dashboard data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">
              Failed to load dashboard data: {error.message}
            </p>
            <p className="text-sm text-red-600 mt-1">
              Using fallback data for now.
            </p>
          </div>
        )}

        {/* Admin Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : (stats?.totalUsers?.toLocaleString() || '0')}
              </div>
              <p className="text-xs text-muted-foreground">
                {loading ? '...' : formatGrowth(stats?.userGrowth || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : (stats?.totalProducts?.toLocaleString() || '0')}
              </div>
              <p className="text-xs text-muted-foreground">
                {loading ? '...' : formatGrowth(stats?.productGrowth || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : (stats?.totalOrders?.toLocaleString() || '0')}
              </div>
              <p className="text-xs text-muted-foreground">
                {loading ? '...' : formatGrowth(stats?.orderGrowth || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                System Health
              </CardTitle>
              {loading ? (
                <Settings className="h-4 w-4 text-muted-foreground" />
              ) : (
                getHealthIcon(stats?.systemHealth?.status || 'UNKNOWN')
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getHealthColor(stats?.systemHealth?.status || 'UNKNOWN')}`}>
                {loading ? '...' : (stats?.systemHealth?.status === 'HEALTHY' ? 'Healthy' : 
                  stats?.systemHealth?.status === 'WARNING' ? 'Warning' :
                  stats?.systemHealth?.status === 'ERROR' ? 'Error' : 'Unknown')}
              </div>
              <p className="text-xs text-muted-foreground">
                {loading ? '...' : (stats?.systemHealth?.message || 'Status unknown')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>
                Manage products and categories
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                View All Products
              </Button>
              <Button className="w-full" variant="outline">
                Manage Categories
              </Button>
              <Button className="w-full" variant="outline">
                Inventory Reports
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                Site Configuration
              </Button>
              <Button className="w-full" variant="outline">
                Payment Settings
              </Button>
              <Button className="w-full" variant="outline">
                System Logs
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Admin Activities</CardTitle>
            <CardDescription>
              Latest system activities and changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {(stats?.recentActivity && stats.recentActivity.length > 0) ? (
                  stats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(activity.createdAt)}
                          {activity.storeName && ` • ${activity.storeName}`}
                          {activity.amount && ` • ${activity.amount} LYD`}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${getActivityStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No recent activities</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}