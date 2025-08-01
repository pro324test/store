import {
  LayoutDashboard,
  Users,
  Settings,
  Shield,
  Package,
  TrendingUp,
  UserCog,
  Bell,
  Command,
  Building,
  ChevronRight,
} from 'lucide-react'

import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'System Admin',
    email: 'admin@store.com',
    avatar: '/avatars/admin.jpg',
  },
  teams: [
    {
      name: 'Store Admin',
      logo: Command,
      plan: 'Management System',
    },
    {
      name: 'E-Commerce Store',
      logo: Building,
      plan: 'Multi-vendor Platform',
    },
  ],
  navGroups: [
    {
      title: 'Overview',
      items: [
        {
          title: 'Dashboard',
          url: '/admin',
          icon: LayoutDashboard,
        },
        {
          title: 'Analytics',
          url: '/admin/analytics',
          icon: TrendingUp,
        },
      ],
    },
    {
      title: 'User Management',
      items: [
        {
          title: 'Users',
          icon: Users,
          items: [
            {
              title: 'All Users',
              url: '/admin/users',
            },
            {
              title: 'User Roles',
              url: '/admin/users/roles',
            },
            {
              title: 'Permissions',
              url: '/admin/users/permissions',
            },
          ],
        },
        {
          title: 'Vendors',
          url: '/admin/vendors',
          icon: UserCog,
        },
      ],
    },
    {
      title: 'Store Management',
      items: [
        {
          title: 'Products',
          icon: Package,
          items: [
            {
              title: 'All Products',
              url: '/admin/products',
            },
            {
              title: 'Categories',
              url: '/admin/products/categories',
            },
            {
              title: 'Inventory',
              url: '/admin/products/inventory',
            },
          ],
        },
        {
          title: 'Orders',
          url: '/admin/orders',
          icon: ChevronRight,
          badge: '12',
        },
      ],
    },
    {
      title: 'System',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'General',
              url: '/admin/settings',
            },
            {
              title: 'Payment Methods',
              url: '/admin/settings/payments',
            },
            {
              title: 'Notifications',
              url: '/admin/settings/notifications',
            },
          ],
        },
        {
          title: 'Security',
          url: '/admin/security',
          icon: Shield,
        },
        {
          title: 'System Logs',
          url: '/admin/logs',
          icon: Bell,
        },
      ],
    },
  ],
}