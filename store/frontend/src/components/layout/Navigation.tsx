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
    <Paper 
      elevation={1} 
      sx={{ 
        mt: 2, 
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg">
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
                    px: 3,
                    py: 1.5,
                    backgroundColor: isActive ? 'primary.main' : 'transparent',
                    color: isActive ? 'white' : 'text.primary',
                    '&:hover': {
                      backgroundColor: isActive ? 'primary.dark' : 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: 'inherit',
                      minWidth: 40,
                    }}
                  >
                    <Icon />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body2" fontWeight={isActive ? 600 : 400}>
                        {t(item.key)}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Container>
    </Paper>
  );
}