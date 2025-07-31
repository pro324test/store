'use client';

import { NextIntlClientProvider } from 'next-intl';
import { Providers } from "@/components/providers";
import { LayoutContent } from "./layout-content";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type Props = {
  children: React.ReactNode;
};

// Force dynamic rendering - disable SSR/SSG
export const dynamic = 'force-dynamic';

export default function LocaleLayout({ children }: Props) {
  const params = useParams();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const locale = params.locale as string;

  useEffect(() => {
    // Validate locale on client side
    if (locale !== 'ar' && locale !== 'en') {
      router.push('/ar'); // Redirect to default locale
      return;
    }

    // Load messages on client side
    const loadMessages = async () => {
      try {
        const moduleMessages = await import(`../../../messages/${locale}.json`);
        setMessages(moduleMessages.default);
      } catch (error) {
        console.error('Failed to load messages:', error);
        // Fallback to Arabic messages
        const fallbackMessages = await import(`../../../messages/ar.json`);
        setMessages(fallbackMessages.default);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [locale, router]);

  // Show loading state while messages are being loaded
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <NextIntlClientProvider messages={messages || {}} locale={locale}>
      <Providers>
        <LayoutContent locale={locale}>{children}</LayoutContent>
      </Providers>
    </NextIntlClientProvider>
  );
}