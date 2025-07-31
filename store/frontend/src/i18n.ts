import { getRequestConfig } from 'next-intl/server';

export const locales = ['ar', 'en'];

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from the request using the new API
  let locale = await requestLocale;
  
  // Validate that the incoming locale parameter is valid
  if (!locales.includes(locale as string)) {
    locale = 'ar'; // fallback to default
  }

  return {
    locale,
    // Messages will be loaded on client-side, so we can return empty object here
    messages: {}
  };
});