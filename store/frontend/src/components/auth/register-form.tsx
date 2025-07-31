'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { RegisterInput } from '@/types/auth';

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { register } = useAuth();
  const t = useTranslations('auth');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegisterInput>({
    phoneNumber: '',
    password: '',
    fullName: '',
    email: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Clean up the form data - remove empty email if not provided
      const submitData = {
        ...formData,
        email: formData.email?.trim() || undefined
      };
      
      await register(submitData);
      // Success - redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Register error:', error);
      setError(t('register_error') || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof RegisterInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t('register') || 'Register'}</CardTitle>
        <CardDescription>
          {t('register_description') || 'Create a new account to get started'}
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
              {t('full_name') || 'Full Name'}
            </label>
            <Input
              type="text"
              placeholder={t('enter_full_name') || 'Enter your full name'}
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('phone_number') || 'Phone Number'}
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
              {t('email') || 'Email'} ({t('optional') || 'Optional'})
            </label>
            <Input
              type="email"
              placeholder={t('enter_email') || 'Enter your email'}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('password') || 'Password'}
            </label>
            <Input
              type="password"
              placeholder={t('enter_password') || 'Enter your password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
            <p className="text-xs text-muted-foreground">
              {t('password_requirements') || 'Minimum 6 characters'}
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (t('registering') || 'Creating account...') : (t('register') || 'Register')}
          </Button>

          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              {t('already_have_account') || "Already have an account?"}{' '}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={onSwitchToLogin}
                disabled={loading}
              >
                {t('login') || 'Login'}
              </button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}