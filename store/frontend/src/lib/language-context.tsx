'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';
type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Basic translations - can be extended later
const translations = {
  ar: {
    'ajjmal_v2': 'أجمل الإصدار الثاني',
    'modern_ecommerce': 'منصة تجارة إلكترونية حديثة مع واجهة شادكن',
    'frontend': 'الواجهة الأمامية',
    'backend': 'الخادم الخلفي',
    'search': 'البحث',
    'get_started': 'ابدأ الآن',
    'view_api': 'عرض واجهة البرمجة',
    'search_products': 'البحث عن المنتجات...',
    'search_button': 'بحث',
    'welcome_title': 'مرحباً بك في أجمل الإصدار الثاني',
    'welcome_description': 'واجهتك الأمامية الجديدة مع Next.js و Shadcn UI جاهزة!',
    'welcome_content': 'هذا تطبيق Next.js جديد مع مكونات Shadcn UI. الواجهة الأمامية تعمل على المنفذ 3001 وهي جاهزة للاتصال بخادمك الخلفي الحالي.',
    'primary_action': 'الإجراء الأساسي',
    'secondary_action': 'الإجراء الثانوي',
    'ghost_button': 'زر شبح',
    'destructive_action': 'إجراء مدمر',
    'frontend_description': 'Next.js 15.4.4 مع Shadcn UI',
    'backend_description': 'NestJS مع GraphQL',
    'search_description': 'ابحث عن المنتجات بسهولة',
    'frontend_subtitle': 'إطار عمل React حديث مع مكونات جميلة',
    'backend_subtitle': 'خادم خلفي قابل للتوسع مع هندسة معمارية حديثة',
    'language': 'اللغة',
    'arabic': 'العربية',
    'english': 'الإنجليزية'
  },
  en: {
    'ajjmal_v2': 'Ajjmal v2',
    'modern_ecommerce': 'Modern e-commerce platform with Shadcn UI',
    'frontend': 'Frontend',
    'backend': 'Backend',
    'search': 'Search',
    'get_started': 'Get Started',
    'view_api': 'View API',
    'search_products': 'Search products...',
    'search_button': 'Search',
    'welcome_title': 'Welcome to Ajjmal v2',
    'welcome_description': 'Your new Next.js frontend with Shadcn UI is ready!',
    'welcome_content': 'This is a fresh Next.js application with Shadcn UI components. The frontend runs on port 3001 and is ready to connect to your existing backend.',
    'primary_action': 'Primary Action',
    'secondary_action': 'Secondary Action',
    'ghost_button': 'Ghost Button',
    'destructive_action': 'Destructive Action',
    'frontend_description': 'Next.js 15.4.4 with Shadcn UI',
    'backend_description': 'NestJS with GraphQL',
    'search_description': 'Find products easily',
    'frontend_subtitle': 'Modern React framework with beautiful components',
    'backend_subtitle': 'Scalable backend with modern architecture',
    'language': 'Language',
    'arabic': 'Arabic',
    'english': 'English'
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar'); // Default to Arabic as main language
  const [direction, setDirection] = useState<Direction>('rtl');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setDirection(lang === 'ar' ? 'rtl' : 'ltr');
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  // Load saved language from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && (savedLanguage === 'ar' || savedLanguage === 'en')) {
        setLanguage(savedLanguage);
      }
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}