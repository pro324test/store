'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4" />
      <span className="text-sm font-medium">{t('language')}:</span>
      <div className="flex gap-1">
        <Button
          variant={locale === 'ar' ? 'default' : 'outline'}
          size="sm"
          onClick={() => switchLocale('ar')}
          className="text-xs"
        >
          {t('arabic')}
        </Button>
        <Button
          variant={locale === 'en' ? 'default' : 'outline'}
          size="sm"
          onClick={() => switchLocale('en')}
          className="text-xs"
        >
          {t('english')}
        </Button>
      </div>
    </div>
  );
}