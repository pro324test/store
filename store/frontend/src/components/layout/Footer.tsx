'use client';

import {
  Box,
  Container,
  Typography,
  Link as MuiLink,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
} from '@mui/icons-material';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <Paper
      component="footer"
      elevation={3}
      sx={{
        mt: 8,
        py: 6,
        backgroundColor: 'grey.100',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
          gap: 4 
        }}>
          {/* Company Info */}
          <Box>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {locale === 'ar' ? 'متجر متعدد البائعين' : 'Multivendor Store'}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {locale === 'ar' 
                ? 'منصة التجارة الإلكترونية الرائدة التي تجمع أفضل البائعين في مكان واحد'
                : 'Leading e-commerce platform bringing together the best vendors in one place'
              }
            </Typography>
            
            {/* Social Media */}
            <Box sx={{ mt: 2 }}>
              <IconButton aria-label="Facebook" color="primary">
                <Facebook />
              </IconButton>
              <IconButton aria-label="Twitter" color="primary">
                <Twitter />
              </IconButton>
              <IconButton aria-label="Instagram" color="primary">
                <Instagram />
              </IconButton>
              <IconButton aria-label="LinkedIn" color="primary">
                <LinkedIn />
              </IconButton>
            </Box>
          </Box>

          {/* Quick Links */}
          <Box>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {locale === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} href="/products" underline="hover">
                {t('navigation.products')}
              </MuiLink>
              <MuiLink component={Link} href="/vendors" underline="hover">
                {t('navigation.vendors')}
              </MuiLink>
              <MuiLink component={Link} href="/categories" underline="hover">
                {t('navigation.categories')}
              </MuiLink>
              <MuiLink component={Link} href="/about" underline="hover">
                {locale === 'ar' ? 'عن الموقع' : 'About Us'}
              </MuiLink>
            </Box>
          </Box>

          {/* Support */}
          <Box>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {locale === 'ar' ? 'الدعم' : 'Support'}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink href="#" underline="hover">
                {locale === 'ar' ? 'اتصل بنا' : 'Contact Us'}
              </MuiLink>
              <MuiLink href="#" underline="hover">
                {locale === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}
              </MuiLink>
              <MuiLink href="#" underline="hover">
                {locale === 'ar' ? 'سياسة الإرجاع' : 'Return Policy'}
              </MuiLink>
              <MuiLink href="#" underline="hover">
                {locale === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
              </MuiLink>
            </Box>
          </Box>
        </Box>

        {/* Copyright */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: 1,
            borderColor: 'divider',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2024 {locale === 'ar' ? 'متجر متعدد البائعين. جميع الحقوق محفوظة.' : 'Multivendor Store. All rights reserved.'}
          </Typography>
        </Box>
      </Container>
    </Paper>
  );
}