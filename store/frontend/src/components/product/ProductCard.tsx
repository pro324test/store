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
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          '& .product-image': {
            transform: 'scale(1.05)',
          },
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
            top: 12,
            [locale === 'ar' ? 'left' : 'right']: 12,
            zIndex: 2,
            fontWeight: 700,
            fontSize: '0.75rem',
            height: 28,
            borderRadius: '14px',
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
          }}
        />
      )}

      {/* Favorite Button */}
      <IconButton
        sx={{
          position: 'absolute',
          top: 12,
          [locale === 'ar' ? 'right' : 'left']: 12,
          zIndex: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          width: 40,
          height: 40,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.2s ease-in-out',
        }}
        onClick={handleToggleFavorite}
      >
        {isFavorite ? (
          <Favorite sx={{ color: 'error.main', fontSize: 20 }} />
        ) : (
          <FavoriteBorder sx={{ fontSize: 20 }} />
        )}
      </IconButton>

      {/* Product Image */}
      <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '16px 16px 0 0' }}>
        <CardMedia
          component="img"
          height="240"
          image={product.image}
          alt={product.name}
          className="product-image"
          sx={{ 
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out',
          }}
        />
        {!product.inStock && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            <Typography
              variant="h6"
              color="text.secondary"
              fontWeight="bold"
              sx={{
                backgroundColor: 'white',
                px: 3,
                py: 1,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              {locale === 'ar' ? 'غير متوفر' : 'Out of Stock'}
            </Typography>
          </Box>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
        {/* Product Name */}
        <Typography
          variant="h6"
          component={Link}
          href={`/products/${product.id}`}
          sx={{
            textDecoration: 'none',
            color: 'text.primary',
            mb: 1,
            fontWeight: 600,
            fontSize: '1.1rem',
            lineHeight: 1.3,
            '&:hover': {
              color: 'primary.main',
            },
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.6rem',
          }}
        >
          {product.name}
        </Typography>

        {/* Vendor */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          gutterBottom
          sx={{ 
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          {t('product.vendor')}: {product.vendor}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating value={product.rating} precision={0.5} size="small" readOnly />
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              ml: 1,
              fontSize: '0.8rem',
              fontWeight: 500,
            }}
          >
            ({product.reviewCount})
          </Typography>
        </Box>

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography 
            variant="h6" 
            color="primary" 
            fontWeight="bold"
            sx={{ fontSize: '1.25rem' }}
          >
            {product.price} {t('common.currency')}
          </Typography>
          {product.originalPrice && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ 
                textDecoration: 'line-through',
                fontSize: '0.875rem',
              }}
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
          sx={{ 
            alignSelf: 'flex-start', 
            mb: 'auto',
            fontWeight: 600,
            fontSize: '0.75rem',
            height: 24,
          }}
        />

        {/* Add to Cart Button */}
        <Button
          variant="contained"
          startIcon={<AddShoppingCart />}
          onClick={handleAddToCart}
          disabled={!product.inStock}
          fullWidth
          sx={{ 
            mt: 2,
            py: 1.5,
            fontWeight: 600,
            fontSize: '0.9rem',
            borderRadius: 2,
            textTransform: 'none',
            ...(product.inStock ? {
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
              },
            } : {}),
          }}
        >
          {t('common.addToCart')}
        </Button>
      </CardContent>
    </Card>
  );
}