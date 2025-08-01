import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['ar', 'en'],

  // Used when no locale matches
  defaultLocale: 'ar',

  // The prefix for the default locale
  localePrefix: {
    mode: 'as-needed',
    prefixes: {
      // If this locale is matched, no prefix is used
      ar: '/',
      // If this locale is matched, this prefix is used
      en: '/en'
    }
  }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);