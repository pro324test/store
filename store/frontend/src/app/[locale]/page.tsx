'use client';

import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
} from '@mui/material';
import { useTranslations, useLocale } from 'next-intl';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';

// Sample product data
const sampleProducts = [
  {
    id: '1',
    name: 'Samsung Galaxy S24 Ultra',
    price: 4500,
    originalPrice: 5000,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    rating: 4.5,
    reviewCount: 128,
    vendor: 'TechStore',
    inStock: true,
  },
  {
    id: '2', 
    name: 'Apple MacBook Pro M3',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop',
    rating: 4.8,
    reviewCount: 89,
    vendor: 'AppleZone',
    inStock: true,
  },
  {
    id: '3',
    name: 'Nike Air Max 270',
    price: 450,
    originalPrice: 600,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    rating: 4.3,
    reviewCount: 256,
    vendor: 'SportsWorld',
    inStock: false,
  },
  {
    id: '4',
    name: 'Canon EOS R6 Mark II',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop',
    rating: 4.7,
    reviewCount: 45,
    vendor: 'PhotoPro',
    inStock: true,
  },
];

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Header />
      <Container maxWidth="xl" sx={{ flexGrow: 1 }}>
        <Navigation />
        
        {/* Hero Section */}
        <Paper
          sx={{
            mt: 4,
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 300,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              zIndex: 1,
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom 
              fontWeight="bold"
              sx={{
                fontSize: { xs: '2rem', md: '3rem', lg: '3.5rem' },
                lineHeight: 1.2,
                mb: 3,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              {locale === 'ar' 
                ? 'مرحباً بك في متجرنا متعدد البائعين' 
                : 'Welcome to Our Multivendor Store'
              }
            </Typography>
            <Typography 
              variant="h5" 
              paragraph 
              sx={{ 
                opacity: 0.95,
                maxWidth: 600,
                mx: 'auto',
                mb: 4,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                lineHeight: 1.5,
              }}
            >
              {locale === 'ar'
                ? 'اكتشف آلاف المنتجات من أفضل البائعين في مكان واحد'
                : 'Discover thousands of products from the best vendors in one place'
              }
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '1.1rem',
                px: 5,
                py: 2,
                borderRadius: 3,
                textTransform: 'none',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                '&:hover': {
                  backgroundColor: 'grey.50',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {locale === 'ar' ? 'تسوق الآن' : 'Shop Now'}
            </Button>
          </Box>
        </Paper>

        {/* Categories Section */}
        <Box sx={{ mt: 6 }}>
          <Typography 
            variant="h3" 
            gutterBottom 
            fontWeight="bold"
            sx={{
              textAlign: 'center',
              mb: 4,
              color: 'text.primary',
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            {t('navigation.categories')}
          </Typography>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { 
              xs: 'repeat(2, 1fr)', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(4, 1fr)' 
            },
            gap: 3,
            mb: 6,
          }}>
            {[
              { name: locale === 'ar' ? 'إلكترونيات' : 'Electronics', icon: '📱' },
              { name: locale === 'ar' ? 'أزياء' : 'Fashion', icon: '👗' },
              { name: locale === 'ar' ? 'رياضة' : 'Sports', icon: '⚽' },
              { name: locale === 'ar' ? 'كتب' : 'Books', icon: '📚' },
            ].map((category, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  border: '2px solid',
                  borderColor: 'grey.200',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.15)',
                    backgroundColor: 'primary.50',
                  },
                }}
              >
                <Typography variant="h3" sx={{ mb: 1 }}>
                  {category.icon}
                </Typography>
                <Typography 
                  variant="h6" 
                  fontWeight="600"
                  color="text.primary"
                >
                  {category.name}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* Featured Products */}
        <Box sx={{ mt: 6, mb: 6 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography 
              variant="h3" 
              gutterBottom 
              fontWeight="bold"
              sx={{
                color: 'text.primary',
                fontSize: { xs: '2rem', md: '2.5rem' },
                mb: 2,
              }}
            >
              {locale === 'ar' ? 'المنتجات المميزة' : 'Featured Products'}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              {locale === 'ar' 
                ? 'تصفح مجموعة مختارة من أفضل المنتجات المتاحة' 
                : 'Browse our curated selection of the best available products'
              }
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              lg: 'repeat(4, 1fr)' 
            }, 
            gap: 4,
          }}>
            {sampleProducts.map((product) => (
              <Box key={product.id}>
                <ProductCard product={product} />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Stats Section */}
        <Paper 
          sx={{ 
            p: { xs: 4, md: 6 }, 
            mt: 6, 
            borderRadius: 4,
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            border: '1px solid',
            borderColor: 'grey.200',
          }}
        >
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: 'repeat(2, 1fr)', 
              md: 'repeat(4, 1fr)' 
            }, 
            gap: 4, 
            textAlign: 'center',
          }}>
            {[
              { value: '1000+', label: locale === 'ar' ? 'منتج' : 'Products', color: 'primary.main' },
              { value: '50+', label: locale === 'ar' ? 'بائع' : 'Vendors', color: 'success.main' },
              { value: '5000+', label: locale === 'ar' ? 'عميل' : 'Customers', color: 'warning.main' },
              { value: '99%', label: locale === 'ar' ? 'رضا العملاء' : 'Satisfaction', color: 'error.main' },
            ].map((stat, index) => (
              <Box key={index}>
                <Typography 
                  variant="h2" 
                  fontWeight="bold"
                  sx={{ 
                    color: stat.color,
                    fontSize: { xs: '2rem', md: '3rem' },
                    mb: 1,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography 
                  variant="h6" 
                  color="text.secondary"
                  fontWeight="600"
                >
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Container>
      
      <Footer />
    </Box>
  );
}