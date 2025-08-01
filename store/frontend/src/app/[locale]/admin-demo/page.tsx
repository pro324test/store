'use client';

// Demo admin dashboard to showcase RTL improvements
export const dynamic = 'force-dynamic';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  Package, 
  TrendingUp, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  LayoutDashboard, 
  UserCog, 
  Bell,
  ChevronRight,
  Command,
  Building
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel
} from '@/components/ui/sidebar';

export default function AdminDemoPage() {
  const t = useTranslations();

  // Mock data for demonstration
  const mockStats = {
    totalUsers: 1234,
    totalProducts: 567,
    totalOrders: 89,
    systemHealth: 'HEALTHY',
    userGrowth: 12,
    productGrowth: 8,
    orderGrowth: 15
  };

  const mockActivities = [
    { id: 1, description: 'New user registered', createdAt: new Date().toISOString(), status: 'COMPLETED' },
    { id: 2, description: 'Product added to inventory', createdAt: new Date(Date.now() - 3600000).toISOString(), status: 'PENDING' },
    { id: 3, description: 'Order processed successfully', createdAt: new Date(Date.now() - 7200000).toISOString(), status: 'COMPLETED' }
  ];

  const formatGrowth = (growth: number) => {
    const sign = growth >= 0 ? '+' : '';
    return `${sign}${growth}% ${t('dashboard.from_last_month')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return t('dashboard.just_now');
    if (diffInMinutes < 60) return t('dashboard.minutes_ago', { count: diffInMinutes });
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return t('dashboard.hours_ago', { count: diffInHours });
    
    const diffInDays = Math.floor(diffInHours / 24);
    return t('dashboard.days_ago', { count: diffInDays });
  };

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

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
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
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full">
        {/* Demo Sidebar */}
        <Sidebar className="w-64 border-r">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <Command className="h-6 w-6" />
              <div>
                <h2 className="font-semibold">{t('navigation.store_admin')}</h2>
                <p className="text-sm text-muted-foreground">{t('navigation.management_system')}</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-2">
            <SidebarGroup>
              <SidebarGroupLabel>{t('navigation.overview')}</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <LayoutDashboard className="h-4 w-4" />
                    <span>{t('navigation.dashboard')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <TrendingUp className="h-4 w-4" />
                    <span>{t('navigation.analytics')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>{t('navigation.user_management')}</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Users className="h-4 w-4" />
                    <span>{t('navigation.users')}</span>
                    <ChevronRight className="ms-auto h-4 w-4 rtl:rotate-180" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <UserCog className="h-4 w-4" />
                    <span>{t('navigation.vendors')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>{t('navigation.store_management')}</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Package className="h-4 w-4" />
                    <span>{t('navigation.products')}</span>
                    <ChevronRight className="ms-auto h-4 w-4 rtl:rotate-180" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <TrendingUp className="h-4 w-4" />
                    <span>{t('navigation.orders_management')}</span>
                    <Badge className="ms-auto">12</Badge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>{t('navigation.system')}</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings className="h-4 w-4" />
                    <span>{t('navigation.settings')}</span>
                    <ChevronRight className="ms-auto h-4 w-4 rtl:rotate-180" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Shield className="h-4 w-4" />
                    <span>{t('navigation.security')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Bell className="h-4 w-4" />
                    <span>{t('navigation.system_logs')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="p-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">System Admin</p>
                <p className="text-xs text-muted-foreground truncate">admin@store.com</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="border-b p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold">{t('dashboard.admin_dashboard')}</h1>
                <p className="text-sm text-muted-foreground">{t('dashboard.system_overview')}</p>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto p-6">
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t('dashboard.total_users')}
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {mockStats.totalUsers.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatGrowth(mockStats.userGrowth)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t('dashboard.total_products')}
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {mockStats.totalProducts.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatGrowth(mockStats.productGrowth)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t('dashboard.total_orders')}
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {mockStats.totalOrders.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatGrowth(mockStats.orderGrowth)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t('dashboard.system_health')}
                    </CardTitle>
                    {getHealthIcon(mockStats.systemHealth)}
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getHealthColor(mockStats.systemHealth)}`}>
                      {t('dashboard.healthy')}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      All systems operational
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('dashboard.product_management')}</CardTitle>
                    <CardDescription>
                      {t('dashboard.manage_products_categories')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" variant="outline">
                      {t('dashboard.view_all_products')}
                    </Button>
                    <Button className="w-full" variant="outline">
                      {t('dashboard.manage_categories')}
                    </Button>
                    <Button className="w-full" variant="outline">
                      {t('dashboard.inventory_reports')}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('dashboard.system_settings')}</CardTitle>
                    <CardDescription>
                      {t('dashboard.configure_system_parameters')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" variant="outline">
                      {t('dashboard.site_configuration')}
                    </Button>
                    <Button className="w-full" variant="outline">
                      {t('dashboard.payment_settings')}
                    </Button>
                    <Button className="w-full" variant="outline">
                      {t('dashboard.system_logs')}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.recent_admin_activities')}</CardTitle>
                  <CardDescription>
                    {t('dashboard.latest_system_activities')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(activity.createdAt)}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${getActivityStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}