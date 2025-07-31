'use client';

import { useState } from 'react';
import { AdminSidebar } from './admin-sidebar';
import { useAuth } from '@/lib/auth-context';
import { Button } from '../ui/button';
import { useRouter, useParams } from 'next/navigation';
import { Bell, User, LogOut } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <AdminSidebar 
          collapsed={sidebarCollapsed} 
          onToggleCollapse={handleToggleSidebar} 
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
              )}
              {description && (
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.fullName}
                  </p>
                  <p className="text-xs text-gray-500">System Administrator</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => router.push(`/${locale}/admin`)}
                  >
                    <User className="w-4 h-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={logout}
                    className="text-red-600 hover:text-red-700"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}