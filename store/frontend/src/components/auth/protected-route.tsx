'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AuthPage } from './auth-page';
import { useTranslations } from 'next-intl';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const t = useTranslations('common');

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">
            {t('loading')}
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login page or custom fallback
  if (!user) {
    return fallback || <AuthPage />;
  }

  // User is authenticated, render protected content
  return <>{children}</>;
}