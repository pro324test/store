'use client';

import {
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import {
  Home,
  Category,
  Store,
  LocalMall,
} from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';

const navigationItems = [
  { key: 'home', href: '/', icon: Home },
  { key: 'products', href: '/products', icon: LocalMall },
  { key: 'vendors', href: '/vendors', icon: Store },
  { key: 'categories', href: '/categories', icon: Category },
];

export default function Navigation() {
  const t = useTranslations('navigation');
  const pathname = usePathname();

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'grey.200',
          background: 'white',
        }}
      >
        <List sx={{ display: 'flex', flexDirection: 'row', p: 0 }}>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <ListItem key={item.key} disablePadding sx={{ width: 'auto' }}>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  sx={{
                    px: { xs: 2, md: 4 },
                    py: 2,
                    backgroundColor: isActive ? 'primary.main' : 'transparent',
                    color: isActive ? 'white' : 'text.primary',
                    borderRadius: 0,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: isActive ? 'primary.dark' : 'grey.50',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: 'inherit',
                      minWidth: { xs: 35, md: 45 },
                    }}
                  >
                    <Icon sx={{ fontSize: { xs: 20, md: 24 } }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography 
                        variant="body1" 
                        fontWeight={isActive ? 700 : 500}
                        sx={{ 
                          fontSize: { xs: '0.875rem', md: '1rem' },
                          display: { xs: 'none', sm: 'block' },
                        }}
                      >
                        {t(item.key)}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Container>
  );
}