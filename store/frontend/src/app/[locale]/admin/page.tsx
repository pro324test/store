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
import { Shield, Users, Package, TrendingUp, Settings } from 'lucide-react';

function AdminDashboardContent() {
  const { user } = useAuth();
  const router = useRouter();

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

  return (
    <AdminLayout 
      title="Admin Dashboard" 
      description="System overview and management tools"
    >
      <div className="space-y-6">
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
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
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
              <div className="text-2xl font-bold">567</div>
              <p className="text-xs text-muted-foreground">
                +5% from last month
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
              <div className="text-2xl font-bold">890</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                System Health
              </CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Healthy</div>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user accounts and roles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => router.push('/admin/users')}
              >
                View All Users
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => router.push('/admin/users/roles')}
              >
                Manage Roles
              </Button>
              <Button className="w-full" variant="outline">
                User Reports
              </Button>
            </CardContent>
          </Card>

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
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">New user registration approved</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Success</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Product inventory updated</p>
                  <p className="text-xs text-gray-500">15 minutes ago</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Info</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">System backup completed</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Success</span>
              </div>
            </div>
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