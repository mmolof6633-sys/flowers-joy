'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Badge } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DehazeIcon from '@mui/icons-material/Dehaze';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCartItemCountQuery } from '@features/cart';

export function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const { data: cartCountData } = useCartItemCountQuery();

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const cartItemCount = cartCountData?.data?.itemCount || 0;

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const homeLink = (
    <Typography
      component={Link}
      href="/"
      variant="h6"
      sx={{
        textDecoration: 'none',
        color: 'inherit',
        fontWeight: 400,
        mr: 3,
        '&:hover': {
          color: theme.palette.primary.light,
        },
      }}
    >
      Главная
    </Typography>
  );

  const catalogLink = (
    <Typography
      component={Link}
      href="/catalog"
      variant="h6"
      sx={{
        textDecoration: 'none',
        color: 'inherit',
        fontWeight: 400,
        '&:hover': {
          color: theme.palette.primary.light,
        },
      }}
    >
      Каталог
    </Typography>
  );

  return (
    <AppBar position="sticky" color="default" elevation={0}>
      <Toolbar
        sx={{
          maxWidth: 1200,
          width: '100%',
          mx: 'auto',
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Логотип / название */}
        <Box
          sx={{
            flexGrow: isMobile ? 1 : 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            Flowers Joy
          </Typography>
        </Box>

        {/* Центральные пункты навигации на десктопе */}
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: 'none', sm: 'flex' },
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {homeLink}
          {catalogLink}
        </Box>

        {/* Иконка корзины */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            ml: 2,
          }}
        >
          <IconButton
            color="inherit"
            onClick={() => router.push('/cart')}
            aria-label="корзина"
            sx={{ position: 'relative' }}
          >
            <Badge badgeContent={cartItemCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Box>

        {/* Бургер-меню на мобильном */}
        <Box
          sx={{
            display: { xs: 'flex', sm: 'none' },
            justifyContent: 'flex-end',
            flexGrow: 0,
          }}
        >
          <IconButton edge="end" color="inherit" aria-label="menu" onClick={handleOpenMenu}>
            <DehazeIcon fontSize="large" />
          </IconButton>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleCloseMenu}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem component={Link} href="/" onClick={handleCloseMenu}>
              Главная
            </MenuItem>
            <MenuItem component={Link} href="/catalog" onClick={handleCloseMenu}>
              Каталог
            </MenuItem>
            <MenuItem
              component={Link}
              href="/cart"
              onClick={handleCloseMenu}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              Корзина
              {cartItemCount > 0 && (
                <Badge badgeContent={cartItemCount} color="error">
                  <Box sx={{ width: 20 }} />
                </Badge>
              )}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
