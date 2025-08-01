'use client';

import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
} from '@mui/material';
import { Store, LocationOn, Star } from '@mui/icons-material';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';

interface Vendor {
  id: string;
  name: string;
  description: string;
  descriptionEn: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  location: string;
  locationEn: string;
  image: string;
  verified: boolean;
}

interface VendorCardProps {
  vendor: Vendor;
}

export default function VendorCard({ vendor }: VendorCardProps) {
  const locale = useLocale();

  return (
    <Card
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
  );
}