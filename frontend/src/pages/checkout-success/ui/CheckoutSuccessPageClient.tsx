'use client';

import { Container, Typography, Box, Paper, Button, Stack } from '@mui/material';
import Link from 'next/link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface CheckoutSuccessPageClientProps {
  orderId: string;
}

export function CheckoutSuccessPageClient({ orderId }: CheckoutSuccessPageClientProps) {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Заказ успешно оформлен!
        </Typography>
        <Typography variant="h6" color="primary" gutterBottom>
          Номер заказа: {orderId}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 4 }}>
          Мы свяжемся с вами в ближайшее время для подтверждения заказа.
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" component={Link} href="/catalog">
            Вернуться в каталог
          </Button>
          <Button variant="outlined" component={Link} href="/">
            На главную
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

