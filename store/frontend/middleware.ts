import createMiddleware from 'next-intl/middleware';
import { locales } from './src/i18n';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // Used when no locale matches
  defaultLocale: 'ar',
  
  // Disable locale detection to avoid server-side complexities
  localeDetection: false
});

export default function middleware(request: any) {
  // Simply use the intl middleware without additional server-side logic
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ar|en)/:path*']
};