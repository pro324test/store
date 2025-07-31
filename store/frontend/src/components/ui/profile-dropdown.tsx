'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from './button';
import { User, Settings, Shield, LogOut, UserCircle } from 'lucide-react';
import { Role } from '@/types/auth';

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const t = useTranslations('auth');
  const tNav = useTranslations('navigation');
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown when pressing Escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Check if user has admin role
  const isAdmin = user?.roles.some(role => role.role === Role.SYSTEM_STAFF && role.isActive);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push(`/${locale}`);
  };

  if (!user) {
    // Show login button for non-authenticated users
    return (
      <Link href={`/${locale}/auth`}>
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5" />
        </Button>
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Icon Button */}
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <User className="w-5 h-5" />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute end-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.fullName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.phoneNumber}
                </p>
                {user.roles.length > 0 && (
                  <p className="text-xs text-gray-400">
                    {user.roles.map(r => r.role).join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {/* Profile Link */}
            <Link 
              href={`/${locale}/profile`}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <UserCircle className="w-4 h-4" />
              {t('profile')}
            </Link>

            {/* Dashboard Link */}
            <Link 
              href={`/${locale}/dashboard`}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              {tNav('dashboard')}
            </Link>

            {/* Admin Dashboard Link - Only show for SYSTEM_STAFF */}
            {isAdmin && (
              <Link 
                href={`/${locale}/admin`}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}

            {/* Divider */}
            <div className="border-t border-gray-100 my-1"></div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-start"
            >
              <LogOut className="w-4 h-4" />
              {t('logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}