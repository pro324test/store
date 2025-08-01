'use client';

import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  Rating,
  Chip,
} from '@mui/material';
import { Store, Star, LocationOn } from '@mui/icons-material';
import { useTranslations, useLocale } from 'next-intl';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Link } from '@/i18n/routing';

const vendors = [
  {
    id: 'techstore',
    name: 'TechStore',
    description: 'أحدث التقنيات والإلكترونيات',
    descriptionEn: 'Latest technology and electronics',
    rating: 4.8,
    reviewCount: 245,
    productCount: 150,
    location: 'الرياض',
    locationEn: 'Riyadh',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
    verified: true,
  },
  {
    id: 'applezone',
    name: 'AppleZone',
    description: 'متخصصون في منتجات Apple',
    descriptionEn: 'Specialized in Apple products',
    rating: 4.9,
    reviewCount: 189,
    productCount: 85,
    location: 'جدة',
    locationEn: 'Jeddah',
    image: 'https://images.unsplash.com/photo-1603912699214-92627f304eb6?w=100&h=100&fit=crop',
    verified: true,
  },
  {
    id: 'sportsworld',
    name: 'SportsWorld',
    description: 'كل ما يخص الرياضة واللياقة البدنية',
    descriptionEn: 'Everything about sports and fitness',
    rating: 4.6,
    reviewCount: 356,
    productCount: 220,
    location: 'الدمام',
    locationEn: 'Dammam',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
    verified: true,
  },
  {
    id: 'photopro',
    name: 'PhotoPro',
    description: 'معدات التصوير الاحترافية',
    descriptionEn: 'Professional photography equipment',
    rating: 4.7,
    reviewCount: 127,
    productCount: 95,
    location: 'الرياض',
    locationEn: 'Riyadh',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=100&h=100&fit=crop',
    verified: true,
  },
  {
    id: 'audiotech',
    name: 'AudioTech',
    description: 'أجهزة الصوت والموسيقى',
    descriptionEn: 'Audio and music equipment',
    rating: 4.5,
    reviewCount: 198,
    productCount: 130,
    location: 'الرياض',
    locationEn: 'Riyadh',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
    verified: false,
  },
  {
    id: 'fashionhub',
    name: 'Fashion Hub',
    description: 'أحدث صيحات الموضة',
    descriptionEn: 'Latest fashion trends',
    rating: 4.4,
    reviewCount: 289,
    productCount: 180,
    location: 'جدة',
    locationEn: 'Jeddah',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop',
    verified: true,
  },
];

export default function VendorsPage() {
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
            {t('vendor.title')}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {locale === 'ar' 
              ? 'اكتشف أفضل البائعين والمتاجر الموثوقة'
              : 'Discover the best trusted vendors and stores'
            }
          </Typography>
        </Box>

        {/* Vendors Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            md: 'repeat(2, 1fr)', 
            lg: 'repeat(3, 1fr)' 
          }, 
          gap: 3,
          mb: 4
        }}>
          {vendors.map((vendor) => (
            <Card
              key={vendor.id}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                {/* Vendor Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={vendor.image}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  >
                    <Store />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {vendor.name}
                      </Typography>
                      {vendor.verified && (
                        <Chip
                          label={locale === 'ar' ? 'موثق' : 'Verified'}
                          size="small"
                          color="success"
                          variant="filled"
                        />
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {locale === 'ar' ? vendor.location : vendor.locationEn}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Description */}
                <Typography variant="body2" color="text.secondary" paragraph>
                  {locale === 'ar' ? vendor.description : vendor.descriptionEn}
                </Typography>

                {/* Rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={vendor.rating} precision={0.1} size="small" readOnly />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    {vendor.rating} ({vendor.reviewCount} {locale === 'ar' ? 'تقييم' : 'reviews'})
                  </Typography>
                </Box>

                {/* Stats */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {vendor.productCount}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {locale === 'ar' ? 'منتج' : 'Products'}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {vendor.reviewCount}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {locale === 'ar' ? 'تقييم' : 'Reviews'}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Star sx={{ color: 'gold', fontSize: 20 }} />
                      <Typography variant="h6" color="primary" fontWeight="bold" sx={{ ml: 0.5 }}>
                        {vendor.rating}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {locale === 'ar' ? 'تقييم' : 'Rating'}
                    </Typography>
                  </Box>
                </Box>

                {/* Actions */}
                <Button
                  component={Link}
                  href={`/vendors/${vendor.id}`}
                  variant="contained"
                  fullWidth
                  startIcon={<Store />}
                >
                  {locale === 'ar' ? 'زيارة المتجر' : 'Visit Store'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Stats Section */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            md: 'repeat(4, 1fr)' 
          }, 
          gap: 3, 
          textAlign: 'center',
          mb: 4
        }}>
          <Box>
            <Typography variant="h3" color="primary" fontWeight="bold">
              {vendors.length}+
            </Typography>
            <Typography variant="h6">
              {locale === 'ar' ? 'بائع موثق' : 'Verified Vendors'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h3" color="primary" fontWeight="bold">
              1200+
            </Typography>
            <Typography variant="h6">
              {locale === 'ar' ? 'منتج متاح' : 'Products Available'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h3" color="primary" fontWeight="bold">
              98%
            </Typography>
            <Typography variant="h6">
              {locale === 'ar' ? 'رضا العملاء' : 'Customer Satisfaction'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h3" color="primary" fontWeight="bold">
              24/7
            </Typography>
            <Typography variant="h6">
              {locale === 'ar' ? 'دعم العملاء' : 'Customer Support'}
            </Typography>
          </Box>
        </Box>
      </Container>
      
      <Footer />
    </Box>
  );
}