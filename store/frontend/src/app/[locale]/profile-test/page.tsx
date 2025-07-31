'use client';

// Force dynamic rendering - disable SSR/SSG
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Edit2, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock user data for testing profile functionality
const mockUser = {
  id: "1",
  fullName: "مدير النظام",
  phoneNumber: "+218911234567",
  email: "admin@ajjmal.ly",
  isActive: true,
  createdAt: "2025-01-01T00:00:00Z",
  roles: [
    { role: "SYSTEM_STAFF", isActive: true, isPrimary: true, createdAt: "2025-01-01T00:00:00Z" }
  ]
};

function ProfileContent() {
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: mockUser.fullName,
    email: mockUser.email || '',
    phoneNumber: mockUser.phoneNumber,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      console.log('Profile updated:', formData);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: mockUser.fullName,
      email: mockUser.email || '',
      phoneNumber: mockUser.phoneNumber,
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {tCommon('back')}
          </Button>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{t('personal_information')}</CardTitle>
                <CardDescription>
                  {t('personal_description')}
                </CardDescription>
              </div>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  {tCommon('edit')}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t('full_name')}</Label>
              {isEditing ? (
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder={t('full_name_placeholder')}
                />
              ) : (
                <p className="text-sm p-2 bg-muted rounded-md">{mockUser.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder={t('email_placeholder')}
                />
              ) : (
                <p className="text-sm p-2 bg-muted rounded-md">{mockUser.email || t('not_provided')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">{t('phone_number')}</Label>
              {isEditing ? (
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder={t('phone_placeholder')}
                />
              ) : (
                <p className="text-sm p-2 bg-muted rounded-md">{mockUser.phoneNumber}</p>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? tCommon('saving') : tCommon('save')}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  {tCommon('cancel')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('account_info')}</CardTitle>
            <CardDescription>
              {t('account_description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">{t('status')}</Label>
                <p className="text-sm text-muted-foreground">
                  {mockUser.isActive ? t('active') : t('inactive')}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">{t('roles')}</Label>
                <p className="text-sm text-muted-foreground">
                  {mockUser.roles.map(r => r.role).join(', ') || t('no_roles')}
                </p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">{t('member_since')}</Label>
              <p className="text-sm text-muted-foreground">
                {new Date(mockUser.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ProfileTest() {
  return <ProfileContent />;
}