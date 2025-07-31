import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Prevent layout shift during font loading
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Ajjmal v2 - أجمل الإصدار الثاني",
  description: "Modern e-commerce platform - منصة تجارة إلكترونية حديثة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Set default values - these will be updated by client-side LayoutContent
  const defaultLocale = 'ar';
  const defaultDirection = 'rtl';
  
  // Font variables
  const fontVariables = `${geistSans.variable} ${geistMono.variable} ${ibmPlexArabic.variable}`;
  const bodyClasses = `${fontVariables} ${defaultDirection} locale-${defaultLocale} antialiased`;

  return (
    <html lang={defaultLocale} dir={defaultDirection} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Prevent layout shift during font loading */
            body { font-display: swap; }
            /* Ensure consistent initial rendering */
            * { box-sizing: border-box; }
            /* Prevent FOUC */
            html { visibility: hidden; opacity: 0; }
            html.loaded { visibility: visible; opacity: 1; transition: opacity 0.1s ease-in; }
          `
        }} />
        <script dangerouslySetInnerHTML={{
          __html: `
            // Mark HTML as loaded to prevent FOUC
            document.addEventListener('DOMContentLoaded', function() {
              document.documentElement.classList.add('loaded');
            });
          `
        }} />
      </head>
      <body
        className={bodyClasses}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}