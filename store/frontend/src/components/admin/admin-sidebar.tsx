'use client';

import { useState } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { 
  Users, 
  Shield, 
  Package, 
  TrendingUp, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserCog,
  BarChart3,
  ShoppingCart,
  Store,
  Bell,
  FileText
} from 'lucide-react';
import { Button } from '../ui/button';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  subItems?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <BarChart3 className="w-5 h-5" />,
    href: '/admin',
  },
  {
    id: 'users',
    label: 'User Management',
    icon: <Users className="w-5 h-5" />,
    href: '/admin/users',
    subItems: [
      {
        id: 'all-users',
        label: 'All Users',
        icon: <Users className="w-4 h-4" />,
        href: '/admin/users',
      },
      {
        id: 'user-roles',
        label: 'User Roles',
        icon: <UserCog className="w-4 h-4" />,
        href: '/admin/users/roles',
      },
      {
        id: 'user-permissions',
        label: 'Permissions',
        icon: <UserCheck className="w-4 h-4" />,
        href: '/admin/users/permissions',
      },
    ],
  },
  {
    id: 'products',
    label: 'Product Management',
    icon: <Package className="w-5 h-5" />,
    href: '/admin/products',
    subItems: [
      {
        id: 'all-products',
        label: 'All Products',
        icon: <Package className="w-4 h-4" />,
        href: '/admin/products',
      },
      {
        id: 'categories',
        label: 'Categories',
        icon: <Store className="w-4 h-4" />,
        href: '/admin/products/categories',
      },
    ],
  },
  {
    id: 'orders',
    label: 'Order Management',
    icon: <ShoppingCart className="w-5 h-5" />,
    href: '/admin/orders',
  },
  {
    id: 'vendors',
    label: 'Vendor Management',
    icon: <Store className="w-5 h-5" />,
    href: '/admin/vendors',
  },
  {
    id: 'analytics',
    label: 'Analytics & Reports',
    icon: <TrendingUp className="w-5 h-5" />,
    href: '/admin/analytics',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <Bell className="w-5 h-5" />,
    href: '/admin/notifications',
  },
  {
    id: 'audit',
    label: 'Audit Logs',
    icon: <FileText className="w-5 h-5" />,
    href: '/admin/audit',
  },
  {
    id: 'settings',
    label: 'System Settings',
    icon: <Settings className="w-5 h-5" />,
    href: '/admin/settings',
  },
];

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AdminSidebar({ collapsed = false, onToggleCollapse }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const [expandedItems, setExpandedItems] = useState<string[]>(['users']);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isItemActive = (href: string) => {
    const fullPath = `/${locale}${href}`;
    return pathname === fullPath || pathname.startsWith(fullPath + '/');
  };

  const isItemExpanded = (itemId: string) => {
    return expandedItems.includes(itemId);
  };

  return (
    <div className={`bg-gray-900 text-white h-full transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-400" />
              <h2 className="text-lg font-semibold">Admin Panel</h2>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-2 overflow-y-auto">
        <ul className="space-y-1">
          {sidebarItems.map((item) => (
            <li key={item.id}>
              <div
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                  isItemActive(item.href)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                onClick={() => {
                  if (item.subItems) {
                    toggleExpanded(item.id);
                  } else {
                    router.push(`/${locale}${item.href}`);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </div>
                {!collapsed && item.subItems && (
                  <ChevronRight 
                    className={`w-4 h-4 transition-transform ${
                      isItemExpanded(item.id) ? 'rotate-90' : ''
                    }`} 
                  />
                )}
              </div>

              {/* Sub Items */}
              {!collapsed && item.subItems && isItemExpanded(item.id) && (
                <ul className="ml-6 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.id}>
                      <div
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                          isItemActive(subItem.href)
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                        onClick={() => router.push(`/${locale}${subItem.href}`)}
                      >
                        {subItem.icon}
                        <span className="text-sm">{subItem.label}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}