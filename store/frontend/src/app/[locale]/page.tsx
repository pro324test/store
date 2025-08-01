'use client';

import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Chip,
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
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Container maxWidth="lg">
        <Navigation />
        
        {/* Hero Section */}
        <Paper
          sx={{
            mt: 3,
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            {locale === 'ar' 
              ? 'مرحباً بك في متجرنا متعدد البائعين' 
              : 'Welcome to Our Multivendor Store'
            }
          </Typography>
          <Typography variant="h6" paragraph sx={{ opacity: 0.9 }}>
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
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              '&:hover': {
                backgroundColor: 'grey.100',
              },
            }}
          >
            {locale === 'ar' ? 'تسوق الآن' : 'Shop Now'}
          </Button>
        </Paper>

        {/* Categories Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            {t('navigation.categories')}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
            {['إلكترونيات', 'أزياء', 'رياضة', 'كتب'].map((category, index) => (
              <Box sx={{ flex: { xs: '1 1 45%', md: '1 1 22%' } }} key={index}>
                <Chip
                  label={category}
                  variant="outlined"
                  sx={{ width: '100%', py: 2, fontSize: '1rem' }}
                  clickable
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Featured Products */}
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            {locale === 'ar' ? 'المنتجات المميزة' : 'Featured Products'}
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(4, 1fr)' 
            }, 
            gap: 3 
          }}>
            {sampleProducts.map((product) => (
              <Box key={product.id}>
                <ProductCard product={product} />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Stats Section */}
        <Paper sx={{ p: 4, mt: 4, borderRadius: 3 }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              md: 'repeat(4, 1fr)' 
            }, 
            gap: 4, 
            textAlign: 'center' 
          }}>
            <Box>
              <Typography variant="h3" color="primary" fontWeight="bold">
                1000+
              </Typography>
              <Typography variant="h6">
                {locale === 'ar' ? 'منتج' : 'Products'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h3" color="primary" fontWeight="bold">
                50+
              </Typography>
              <Typography variant="h6">
                {locale === 'ar' ? 'بائع' : 'Vendors'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h3" color="primary" fontWeight="bold">
                5000+
              </Typography>
              <Typography variant="h6">
                {locale === 'ar' ? 'عميل' : 'Customers'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h3" color="primary" fontWeight="bold">
                99%
              </Typography>
              <Typography variant="h6">
                {locale === 'ar' ? 'رضا العملاء' : 'Satisfaction'}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
      
      <Footer />
    </Box>
  );
}