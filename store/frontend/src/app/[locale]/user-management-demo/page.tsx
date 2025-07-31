'use client';

// Force dynamic rendering - disable SSR/SSG
export const dynamic = 'force-dynamic';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  UserCheck,
  UserX,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

// Demo user data
const demoUsers = [
  {
    id: 1,
    fullName: 'أحمد محمد',
    phoneNumber: '+966501234567',
    email: 'ahmed@example.com',
    isActive: true,
    createdAt: '2024-01-15T10:30:00.000Z',
    roles: [
      { id: 1, role: 'مستخدم', isActive: true, isPrimary: true }
    ]
  },
  {
    id: 2,
    fullName: 'فاطمة علي',
    phoneNumber: '+966509876543',
    email: 'fatima@example.com',
    isActive: false,
    createdAt: '2024-01-10T14:20:00.000Z',
    roles: [
      { id: 2, role: 'مدير', isActive: true, isPrimary: true },
      { id: 3, role: 'محرر', isActive: false, isPrimary: false }
    ]
  },
  {
    id: 3,
    fullName: 'محمد سعد',
    phoneNumber: '+966505555555',
    email: null,
    isActive: true,
    createdAt: '2024-01-05T09:15:00.000Z',
    roles: []
  }
];

export default function UserManagementDemo() {
  const t = useTranslations('admin.user_management');
  const tCommon = useTranslations('common');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6" />
              {t('title')} - العرض التوضيحي
            </h2>
            <p className="text-gray-600">{t('description')}</p>
          </div>
          
          <Button className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            {t('add_user')}
          </Button>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={t('search_placeholder')}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                {t('filters')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Create Form Demo */}
        <Card>
          <CardHeader>
            <CardTitle>{t('create_new_user')}</CardTitle>
            <CardDescription>{t('add_new_user_system')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">{t('form.full_name')} *</Label>
                <Input
                  id="fullName"
                  placeholder={t('form.full_name_placeholder')}
                />
              </div>
              
              <div>
                <Label htmlFor="phoneNumber">{t('form.phone_number')} *</Label>
                <Input
                  id="phoneNumber"
                  placeholder={t('form.phone_placeholder')}
                />
              </div>
              
              <div>
                <Label htmlFor="email">{t('form.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('form.email_placeholder')}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button>{t('form.create_user')}</Button>
              <Button variant="outline">{tCommon('cancel')}</Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('all_users')} ({demoUsers.length})</CardTitle>
            <CardDescription>{t('manage_monitor_users')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left p-4 font-semibold text-gray-900">{t('table_headers.user')}</th>
                    <th className="text-left p-4 font-semibold text-gray-900">{t('table_headers.contact')}</th>
                    <th className="text-left p-4 font-semibold text-gray-900">{t('table_headers.status')}</th>
                    <th className="text-left p-4 font-semibold text-gray-900">{t('table_headers.roles')}</th>
                    <th className="text-left p-4 font-semibold text-gray-900">{t('table_headers.joined')}</th>
                    <th className="text-right p-4 font-semibold text-gray-900">{t('table_headers.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {demoUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-gray-900">{user.fullName}</div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            {user.phoneNumber}
                          </div>
                          {user.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4" />
                              {user.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? t('status.active') : t('status.inactive')}
                        </span>
                      </td>
                      <td className="p-4">
                        {user.roles.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map((role) => (
                              <span 
                                key={role.id}
                                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                  role.isActive
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {role.role} {role.isPrimary && `(${t('roles.primary')})`}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">{t('roles.no_roles')}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 text-xs"
                            title={user.isActive ? t('actions.deactivate_user') : t('actions.activate_user')}
                          >
                            {user.isActive ? (
                              <UserX className="w-3 h-3" />
                            ) : (
                              <UserCheck className="w-3 h-3" />
                            )}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 text-xs"
                            title={t('actions.edit_user')}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 hover:border-red-300"
                            title={t('actions.delete_user')}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}