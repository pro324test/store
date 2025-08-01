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
} from '@mui/material';
import {
  ShoppingCart,
  Person,
  Search,
  Language,
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
    <AppBar position="sticky" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
          }}
        >
          {locale === 'ar' ? 'متجر متعدد البائعين' : 'Multivendor Store'}
        </Typography>

        {/* Search Bar */}
        <Box sx={{ flexGrow: 1, maxWidth: 600, mx: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={t('common.search')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
              },
            }}
          />
        </Box>

        {/* Navigation Items */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Language Switcher */}
          <IconButton
            color="inherit"
            onClick={handleLanguageMenuOpen}
            aria-label="language"
          >
            <Language />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleLanguageMenuClose}
          >
            <MenuItem
              onClick={() => handleLanguageChange('ar')}
              selected={locale === 'ar'}
            >
              العربية
            </MenuItem>
            <MenuItem
              onClick={() => handleLanguageChange('en')}
              selected={locale === 'en'}
            >
              English
            </MenuItem>
          </Menu>

          {/* Cart */}
          <IconButton
            color="inherit"
            component={Link}
            href="/cart"
            aria-label="cart"
          >
            <Badge badgeContent={3} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {/* User Menu */}
          <IconButton
            color="inherit"
            onClick={handleUserMenuOpen}
            aria-label="user menu"
          >
            <Person />
          </IconButton>
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
          >
            <MenuItem component={Link} href="/profile">
              {t('navigation.profile')}
            </MenuItem>
            <MenuItem component={Link} href="/login">
              {t('navigation.login')}
            </MenuItem>
            <MenuItem component={Link} href="/register">
              {t('navigation.register')}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}