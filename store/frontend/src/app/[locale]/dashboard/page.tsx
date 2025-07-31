'use client';

// Force dynamic rendering - disable SSR/SSG
export const dynamic = 'force-dynamic';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuth } from '@/lib/auth-context';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

function DashboardContent() {
  const { user, logout } = useAuth();
  const t = useTranslations('dashboard');
  const tAuth = useTranslations('auth');
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              {t('welcome')}, {user?.fullName}!
            </h1>
            <p className="text-muted-foreground">
              Your personal dashboard
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            {tAuth('logout')}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Your account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Phone:</strong> {user?.phoneNumber}</p>
              <p><strong>Email:</strong> {user?.email || 'Not provided'}</p>
              <p><strong>Status:</strong> {user?.isActive ? 'Active' : 'Inactive'}</p>
              <p><strong>Roles:</strong> {user?.roles.map(r => r.role).join(', ')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('quick_actions')}</CardTitle>
              <CardDescription>
                Common tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full"
                onClick={() => router.push('/profile')}
              >
                View Profile
              </Button>
              <Button variant="outline" className="w-full">
                Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('recent_activity')}</CardTitle>
              <CardDescription>
                Your latest actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No recent activity
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}