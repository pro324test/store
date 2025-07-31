'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { LoginInput } from '@/types/auth';

interface LoginFormProps {
  onSwitchToRegister?: () => void;
  onSwitchToOTP?: () => void;
}

export function LoginForm({ onSwitchToRegister, onSwitchToOTP }: LoginFormProps) {
  const { login } = useAuth();
  const t = useTranslations('auth');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<LoginInput>({
    phoneNumber: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(formData);
      // Success - redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(t('login_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t('login')}</CardTitle>
        <CardDescription>
          {t('login_description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('phone_number')}
            </label>
            <Input
              type="tel"
              placeholder="+218911234567"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('password')}
            </label>
            <Input
              type="password"
              placeholder={t('enter_password')}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('logging_in') : t('login')}
          </Button>

          <div className="text-center space-y-2">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={onSwitchToOTP}
              disabled={loading}
            >
              {t('login_with_otp')}
            </button>
            
            <div className="text-sm text-muted-foreground">
              {t('dont_have_account')}{' '}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={onSwitchToRegister}
                disabled={loading}
              >
                {t('register')}
              </button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}