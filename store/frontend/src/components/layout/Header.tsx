'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Container,
  Avatar,
  Divider,
} from '@mui/material';
import {
  ShoppingCart,
  Person,
  Search,
  Language,
  Notifications,
  FavoriteBorder,
} from '@mui/icons-material';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/routing';

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    handleLanguageMenuClose();
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar 
          sx={{ 
            justifyContent: 'space-between',
            py: 1,
            minHeight: '70px !important',
          }}
        >
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h5"
              component={Link}
              href="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
              }}
            >
              {locale === 'ar' ? 'متجر متعدد البائعين' : 'Multivendor Store'}
            </Typography>
          </Box>

          {/* Search Bar */}
          <Box sx={{ flexGrow: 1, maxWidth: 600, mx: 4 }}>
            <TextField
              fullWidth
              size="medium"
              placeholder={t('common.search')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: 'grey.50',
                  borderRadius: 3,
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&:hover': {
                    backgroundColor: 'grey.100',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'white',
                    boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                  },
                },
              }}
            />
          </Box>

          {/* Navigation Items */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Wishlist */}
            <IconButton
              color="inherit"
              component={Link}
              href="/wishlist"
              sx={{
                borderRadius: 2,
                p: 1.5,
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              <Badge badgeContent={2} color="secondary">
                <FavoriteBorder />
              </Badge>
            </IconButton>

            {/* Notifications */}
            <IconButton
              color="inherit"
              sx={{
                borderRadius: 2,
                p: 1.5,
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              <Badge badgeContent={5} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            {/* Language Switcher */}
            <IconButton
              color="inherit"
              onClick={handleLanguageMenuOpen}
              sx={{
                borderRadius: 2,
                p: 1.5,
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              <Language />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleLanguageMenuClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <MenuItem
                onClick={() => handleLanguageChange('ar')}
                selected={locale === 'ar'}
                sx={{ px: 3, py: 1.5 }}
              >
                العربية
              </MenuItem>
              <MenuItem
                onClick={() => handleLanguageChange('en')}
                selected={locale === 'en'}
                sx={{ px: 3, py: 1.5 }}
              >
                English
              </MenuItem>
            </Menu>

            {/* Cart */}
            <IconButton
              color="inherit"
              component={Link}
              href="/cart"
              sx={{
                borderRadius: 2,
                p: 1.5,
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              <Badge badgeContent={3} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {/* User Menu */}
            <IconButton
              onClick={handleUserMenuOpen}
              sx={{
                borderRadius: 2,
                p: 0.5,
                ml: 1,
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  bgcolor: 'primary.main',
                  fontSize: '0.9rem',
                }}
              >
                U
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={handleUserMenuClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  minWidth: 200,
                },
              }}
            >
              <MenuItem component={Link} href="/profile" sx={{ px: 3, py: 1.5 }}>
                <Person sx={{ mr: 2, fontSize: 20 }} />
                {t('navigation.profile')}
              </MenuItem>
              <Divider />
              <MenuItem component={Link} href="/login" sx={{ px: 3, py: 1.5 }}>
                {t('navigation.login')}
              </MenuItem>
              <MenuItem component={Link} href="/register" sx={{ px: 3, py: 1.5 }}>
                {t('navigation.register')}
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}