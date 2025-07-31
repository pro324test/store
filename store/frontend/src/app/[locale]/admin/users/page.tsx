'use client';

// Force dynamic rendering - disable SSR/SSG
export const dynamic = 'force-dynamic';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { AdminLayout } from '@/components/admin/admin-layout';
import { UserManagement } from '@/components/admin/user-management';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Role } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

function UserManagementPageContent() {
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations('admin.user_management');
  const tCommon = useTranslations('common');

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
            {tCommon('back')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout 
      title={t('title')} 
      description={t('description')}
    >
      <UserManagement />
    </AdminLayout>
  );
}

export default function UserManagementPage() {
  return (
    <ProtectedRoute>
      <UserManagementPageContent />
    </ProtectedRoute>
  );
}