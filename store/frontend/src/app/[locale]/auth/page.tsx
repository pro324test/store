import { AuthPage } from '@/components/auth/auth-page';

// Force dynamic rendering - disable SSR/SSG
export const dynamic = 'force-dynamic';

export default function AuthRoute() {
  return <AuthPage />;
}