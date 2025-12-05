'use client';

import { Box, Typography, Link as MuiLink, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TelegramIcon from '@mui/icons-material/Telegram';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        py: 4,
        mt: 'auto',
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          width: '100%',
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {/* Текст о правах */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            textAlign: { xs: 'center', sm: 'left' },
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
          }}
        >
          Все права защищены. Незаконное копирование преследуется по закону.
        </Typography>

        {/* Социальные сети */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
          }}
        >
          <IconButton
            component={MuiLink}
            href="https://t.me/Flowersjoyy"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                color: theme.palette.primary.main,
                backgroundColor: 'transparent',
              },
            }}
          >
            <TelegramIcon />
          </IconButton>

          <IconButton
            component={MuiLink}
            href="https://www.instagram.com/flowersjoy_?igsh=MW96ZmJleWw1MmVlcA=="
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                color: theme.palette.primary.main,
                backgroundColor: 'transparent',
              },
            }}
          >
            <InstagramIcon />
          </IconButton>

          <IconButton
            component={MuiLink}
            href="https://wa.me/message/AMBAOBKONDSOI1"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                color: theme.palette.primary.main,
                backgroundColor: 'transparent',
              },
            }}
          >
            <WhatsAppIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

