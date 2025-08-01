'use client';

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  IconButton,
} from '@mui/material';
import {
  AddShoppingCart,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  vendor: string;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log('Added to cart:', product.id);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-4px)',
          transition: 'transform 0.2s ease-in-out',
        },
      }}
    >
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <Chip
          label={`-${discountPercentage}%`}
          color="error"
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            [locale === 'ar' ? 'left' : 'right']: 8,
            zIndex: 1,
            fontWeight: 'bold',
          }}
        />
      )}

      {/* Favorite Button */}
      <IconButton
        sx={{
          position: 'absolute',
          top: 8,
          [locale === 'ar' ? 'right' : 'left']: 8,
          zIndex: 1,
          backgroundColor: 'white',
          '&:hover': {
            backgroundColor: 'grey.100',
          },
        }}
        onClick={handleToggleFavorite}
      >
        {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
      </IconButton>

      {/* Product Image */}
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Product Name */}
        <Typography
          variant="h6"
          component={Link}
          href={`/products/${product.id}`}
          sx={{
            textDecoration: 'none',
            color: 'text.primary',
            mb: 1,
            '&:hover': {
              color: 'primary.main',
            },
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </Typography>

        {/* Vendor */}
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {t('product.vendor')}: {product.vendor}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={product.rating} precision={0.5} size="small" readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({product.reviewCount})
          </Typography>
        </Box>

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="h6" color="primary" fontWeight="bold">
            {product.price} {t('common.currency')}
          </Typography>
          {product.originalPrice && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: 'line-through' }}
            >
              {product.originalPrice} {t('common.currency')}
            </Typography>
          )}
        </Box>

        {/* Stock Status */}
        <Chip
          label={product.inStock ? t('product.inStock') : t('product.outOfStock')}
          color={product.inStock ? 'success' : 'error'}
          size="small"
          sx={{ alignSelf: 'flex-start', mb: 2 }}
        />

        {/* Add to Cart Button */}
        <Button
          variant="contained"
          startIcon={<AddShoppingCart />}
          onClick={handleAddToCart}
          disabled={!product.inStock}
          fullWidth
          sx={{ mt: 'auto' }}
        >
          {t('common.addToCart')}
        </Button>
      </CardContent>
    </Card>
  );
}