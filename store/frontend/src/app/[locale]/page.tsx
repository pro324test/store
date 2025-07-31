'use client';

// Force dynamic rendering - disable SSR/SSG
export const dynamic = 'force-dynamic';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { SwiperSlider } from "@/components/ui/swiper-slider";
import { CategoryCard } from "@/components/ui/category-card";
import { ProductCard } from "@/components/ui/product-card";
import { SectionTitle } from "@/components/ui/section-title";
import { useTranslations } from 'next-intl';
import { useAuth } from "@/lib/auth-context";
import { useParams } from 'next/navigation';
import Link from "next/link";
import { Search, ShoppingCart, Heart } from "lucide-react";
import { sampleSlides, sampleCategories, sampleProducts } from "@/lib/sample-data";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";

export default function Home() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('common');
  const tNav = useTranslations('navigation');
  const tAuth = useTranslations('auth');
  const tProducts = useTranslations('products');
  const tCategories = useTranslations('categories');
  const tHomepage = useTranslations('homepage');
  const { user, logout } = useAuth();

  const featuredProducts = sampleProducts.filter(p => p.isFeatured);
  const mainCategories = sampleCategories.slice(0, 6); // Show first 6 categories

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4">
          {/* Top bar with language switcher and user info */}
          <div className="flex items-center justify-between py-2 text-sm border-b">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">{tHomepage('welcome')}</span>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {tAuth('profile')}: {user.fullName}
                  </span>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    {tAuth('logout')}
                  </Button>
                </div>
              ) : (
                <Link href={`/${locale}/auth`}>
                  <Button variant="ghost" size="sm">
                    {tAuth('login')} / {tAuth('register')}
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Main navigation */}
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href={`/${locale}`} className="text-2xl font-bold text-primary">
              {t('ajjmal_v2')}
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute start-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder={t('search_products')} 
                  className="ps-10 pe-4"
                />
                <Button className="absolute end-1 top-1/2 transform -translate-y-1/2" size="sm">
                  {t('search_button')}
                </Button>
              </div>
            </div>

            {/* Navigation Icons */}
            <div className="flex items-center gap-4">
              <Link href={`/${locale}/wishlist`}>
                <Button variant="ghost" size="icon">
                  <Heart className="w-5 h-5" />
                </Button>
              </Link>
              <Link href={`/${locale}/cart`}>
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="w-5 h-5" />
                </Button>
              </Link>
              <ProfileDropdown />
            </div>
          </div>

          {/* Main Navigation Menu */}
          <nav className="py-3 border-t">
            <div className="flex items-center gap-8">
              <Link href={`/${locale}`} className="font-medium hover:text-primary transition-colors">
                {tNav('home')}
              </Link>
              <Link href={`/${locale}/categories`} className="font-medium hover:text-primary transition-colors">
                {tNav('categories')}
              </Link>
              <Link href={`/${locale}/products`} className="font-medium hover:text-primary transition-colors">
                {tNav('products')}
              </Link>
              {user && (
                <>
                  <Link href={`/${locale}/orders`} className="font-medium hover:text-primary transition-colors">
                    {tNav('orders')}
                  </Link>
                  <Link href={`/${locale}/dashboard`} className="font-medium hover:text-primary transition-colors">
                    {tNav('dashboard')}
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Slider */}
        <section>
          <SwiperSlider slides={sampleSlides} />
        </section>

        {/* Categories Section */}
        <section>
          <SectionTitle 
            title={tCategories('main_categories')}
            description={tCategories('main_categories_description')}
            viewAllLink="/categories"
            viewAllText={tCategories('view_all')}
            className="mb-8"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {mainCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
        <section>
          <SectionTitle 
            title={tProducts('featured_products')}
            description={tProducts('featured_products_description')}
            viewAllLink="/products?featured=true"
            viewAllText={tProducts('view_all')}
            className="mb-8"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Latest Products Section */}
        <section>
          <SectionTitle 
            title={tProducts('latest_products')}
            description={tProducts('latest_products_description')}
            viewAllLink="/products"
            viewAllText={tProducts('view_all')}
            className="mb-8"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sampleProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {tHomepage('hero_title')}
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            {tHomepage('hero_description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/products`}>
              <Button size="lg" variant="secondary" className="text-lg px-8">
                {tHomepage('shop_now')}
              </Button>
            </Link>
            <Link href={`/${locale}/categories`}>
              <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
                {tHomepage('browse_categories')}
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{t('ajjmal_v2')}</h3>
              <p className="text-gray-300">{t('modern_ecommerce')}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{tNav('categories')}</h4>
              <ul className="space-y-2 text-gray-300">
                {mainCategories.slice(0, 4).map((category) => (
                  <li key={category.id}>
                    <Link href={`/${locale}/categories/${category.slug}`} className="hover:text-white transition-colors">
                      {locale === 'ar' ? category.name : category.nameEn}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{tNav('products')}</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href={`/${locale}/products?featured=true`} className="hover:text-white transition-colors">{tProducts('featured_products')}</Link></li>
                <li><Link href={`/${locale}/products`} className="hover:text-white transition-colors">{tProducts('latest_products')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{tAuth('account_settings')}</h4>
              <ul className="space-y-2 text-gray-300">
                {user ? (
                  <>
                    <li><Link href={`/${locale}/dashboard`} className="hover:text-white transition-colors">{tNav('dashboard')}</Link></li>
                    <li><Link href={`/${locale}/orders`} className="hover:text-white transition-colors">{tNav('orders')}</Link></li>
                    <li><Link href={`/${locale}/profile`} className="hover:text-white transition-colors">{tAuth('profile')}</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link href={`/${locale}/auth`} className="hover:text-white transition-colors">{tAuth('login')}</Link></li>
                    <li><Link href={`/${locale}/auth`} className="hover:text-white transition-colors">{tAuth('register')}</Link></li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 {t('ajjmal_v2')}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
