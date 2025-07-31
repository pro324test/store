'use client';

import { useEffect } from 'react';

interface LayoutContentProps { 
  children: React.ReactNode;
  locale: string;
}

export function LayoutContent({ children, locale }: LayoutContentProps) {
  useEffect(() => {
    // Set the correct direction and lang attributes based on locale
    const direction = locale === 'en' ? 'ltr' : 'rtl';
    const html = document.documentElement;
    const body = document.body;
    
    // Update HTML attributes
    html.setAttribute('dir', direction);
    html.setAttribute('lang', locale);
    
    // Update body classes to reflect the correct locale and direction
    const currentClasses = body.className;
    const newClasses = currentClasses
      .replace(/\b(rtl|ltr)\b/g, '') // Remove existing direction classes
      .replace(/\blocale-(ar|en)\b/g, '') // Remove existing locale classes
      .trim();
    
    body.className = `${newClasses} ${direction} locale-${locale}`.trim();
  }, [locale]);

  return <>{children}</>;
}