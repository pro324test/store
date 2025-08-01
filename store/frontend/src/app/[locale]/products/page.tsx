'use client';

import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';
import { useTranslations, useLocale } from 'next-intl';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';

// Extended sample product data
const allProducts = [
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
  {
    id: '5',
    name: 'Sony WH-1000XM5 Headphones',
    price: 1200,
    originalPrice: 1500,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    rating: 4.6,
    reviewCount: 312,
    vendor: 'AudioTech',
    inStock: true,
  },
  {
    id: '6',
    name: 'Adidas Ultraboost 22',
    price: 680,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
    rating: 4.4,
    reviewCount: 189,
    vendor: 'SportsWorld',
    inStock: true,
  },
];

export default function ProductsPage() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Container maxWidth="lg">
        <Navigation />
        
        {/* Page Header */}
        <Box sx={{ mt: 3, mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            {t('product.title')}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {locale === 'ar' 
              ? 'تصفح مجموعة واسعة من المنتجات من مختلف البائعين'
              : 'Browse a wide selection of products from various vendors'
            }
          </Typography>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder={t('common.search')}
              variant="outlined"
              size="small"
              sx={{ minWidth: 250 }}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>
                {locale === 'ar' ? 'البائع' : 'Vendor'}
              </InputLabel>
              <Select label={locale === 'ar' ? 'البائع' : 'Vendor'}>
                <MenuItem value="all">
                  {locale === 'ar' ? 'جميع البائعين' : 'All Vendors'}
                </MenuItem>
                <MenuItem value="techstore">TechStore</MenuItem>
                <MenuItem value="applezone">AppleZone</MenuItem>
                <MenuItem value="sportsworld">SportsWorld</MenuItem>
                <MenuItem value="photopro">PhotoPro</MenuItem>
                <MenuItem value="audiotech">AudioTech</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>
                {locale === 'ar' ? 'السعر' : 'Price'}
              </InputLabel>
              <Select label={locale === 'ar' ? 'السعر' : 'Price'}>
                <MenuItem value="all">
                  {locale === 'ar' ? 'جميع الأسعار' : 'All Prices'}
                </MenuItem>
                <MenuItem value="0-500">0 - 500 {t('common.currency')}</MenuItem>
                <MenuItem value="500-2000">500 - 2000 {t('common.currency')}</MenuItem>
                <MenuItem value="2000+">2000+ {t('common.currency')}</MenuItem>
              </Select>
            </FormControl>
            <Button variant="outlined" startIcon={<FilterList />}>
              {locale === 'ar' ? 'المرشحات' : 'Filters'}
            </Button>
          </Box>
          
          {/* Active Filters */}
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip 
              label={locale === 'ar' ? 'متوفر' : 'In Stock'} 
              onDelete={() => {}} 
              color="primary" 
              variant="outlined" 
            />
            <Chip 
              label="TechStore" 
              onDelete={() => {}} 
              color="secondary" 
              variant="outlined" 
            />
          </Box>
        </Paper>

        {/* Products Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)' 
          }, 
          gap: 3,
          mb: 4
        }}>
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Box>

        {/* Load More */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Button variant="outlined" size="large">
            {locale === 'ar' ? 'تحميل المزيد' : 'Load More'}
          </Button>
        </Box>
      </Container>
      
      <Footer />
    </Box>
  );
}