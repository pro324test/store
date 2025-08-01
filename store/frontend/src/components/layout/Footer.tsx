'use client';

import {
  Box,
  Container,
  Typography,
  Link as MuiLink,
  IconButton,
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
    <Box
      component="footer"
      sx={{
        mt: 8,
        py: 8,
        backgroundColor: 'grey.900',
        color: 'white',
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, 
          gap: 6,
          mb: 6,
        }}>
          {/* Company Info */}
          <Box sx={{ gridColumn: { xs: '1', md: '1 / 3' } }}>
            <Typography 
              variant="h5" 
              gutterBottom 
              fontWeight="bold"
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
              }}
            >
              {locale === 'ar' ? 'متجر متعدد البائعين' : 'Multivendor Store'}
            </Typography>
            <Typography 
              variant="body1" 
              color="grey.300" 
              paragraph
              sx={{ 
                lineHeight: 1.7,
                maxWidth: 400,
              }}
            >
              {locale === 'ar' 
                ? 'منصة التجارة الإلكترونية الرائدة التي تجمع أفضل البائعين في مكان واحد. نقدم تجربة تسوق استثنائية بأعلى معايير الجودة والأمان.'
                : 'Leading e-commerce platform bringing together the best vendors in one place. We provide an exceptional shopping experience with the highest standards of quality and security.'
              }
            </Typography>
            
            {/* Social Media */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight="600" sx={{ mb: 2 }}>
                {locale === 'ar' ? 'تابعنا' : 'Follow Us'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {[Facebook, Twitter, Instagram, LinkedIn].map((Icon, index) => (
                  <IconButton 
                    key={index}
                    sx={{
                      backgroundColor: 'grey.800',
                      color: 'white',
                      width: 48,
                      height: 48,
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease-in-out',
                    }}
                  >
                    <Icon />
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Quick Links */}
          <Box>
            <Typography variant="h6" gutterBottom fontWeight="600" sx={{ mb: 3 }}>
              {locale === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { href: '/products', label: t('navigation.products') },
                { href: '/vendors', label: t('navigation.vendors') },
                { href: '/categories', label: t('navigation.categories') },
                { href: '/about', label: locale === 'ar' ? 'عن الموقع' : 'About Us' },
                { href: '/offers', label: locale === 'ar' ? 'العروض' : 'Offers' },
              ].map((link, index) => (
                <MuiLink 
                  key={index}
                  component={Link} 
                  href={link.href}
                  color="grey.300"
                  underline="none"
                  sx={{
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      color: 'primary.light',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Box>
          </Box>

          {/* Support */}
          <Box>
            <Typography variant="h6" gutterBottom fontWeight="600" sx={{ mb: 3 }}>
              {locale === 'ar' ? 'الدعم' : 'Support'}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { href: '#', label: locale === 'ar' ? 'اتصل بنا' : 'Contact Us' },
                { href: '#', label: locale === 'ar' ? 'الأسئلة الشائعة' : 'FAQ' },
                { href: '#', label: locale === 'ar' ? 'سياسة الإرجاع' : 'Return Policy' },
                { href: '#', label: locale === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions' },
                { href: '#', label: locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy' },
              ].map((link, index) => (
                <MuiLink 
                  key={index}
                  href={link.href}
                  color="grey.300"
                  underline="none"
                  sx={{
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      color: 'primary.light',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Newsletter Signup */}
        <Box
          sx={{
            py: 4,
            px: 6,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            textAlign: 'center',
            mb: 6,
          }}
        >
          <Typography variant="h5" gutterBottom fontWeight="bold">
            {locale === 'ar' ? 'اشترك في النشرة الإخبارية' : 'Subscribe to Newsletter'}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 500, mx: 'auto' }}>
            {locale === 'ar' 
              ? 'احصل على آخر العروض والمنتجات الجديدة' 
              : 'Get the latest offers and new products'
            }
          </Typography>
        </Box>

        {/* Copyright */}
        <Box
          sx={{
            pt: 4,
            borderTop: 1,
            borderColor: 'grey.800',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="grey.400" sx={{ fontSize: '0.9rem' }}>
            © 2024 {locale === 'ar' ? 'متجر متعدد البائعين. جميع الحقوق محفوظة.' : 'Multivendor Store. All rights reserved.'}
          </Typography>
          <Typography variant="body2" color="grey.500" sx={{ mt: 1, fontSize: '0.8rem' }}>
            {locale === 'ar' ? 'تم التطوير بـ ❤️ من أجل تجربة تسوق أفضل' : 'Made with ❤️ for a better shopping experience'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}