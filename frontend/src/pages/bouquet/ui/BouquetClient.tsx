'use client';

import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material';
import { IBouquet } from '@entities/bouquet';
import Image from 'next/image';

interface BouquetClientProps {
  bouquet: IBouquet;
}

export function BouquetClient({ bouquet }: BouquetClientProps) {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          {(bouquet.images?.[0] || bouquet.imageUrl) ? (
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4/5',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Image
                src={bouquet.images?.[0] || bouquet.imageUrl || ''}
                alt={bouquet.name}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </Box>
          ) : (
            <Paper
              sx={{
                width: '100%',
                aspectRatio: '4/5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.100',
              }}
            >
              <Typography color="text.secondary">Нет изображения</Typography>
            </Paper>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {bouquet.name}
          </Typography>
          {bouquet.description && (
            <Typography variant="body1" color="text.secondary" paragraph>
              {bouquet.description}
            </Typography>
          )}
          <Box sx={{ my: 3 }}>
            <Typography variant="h5" color="primary" gutterBottom>
              {bouquet.price.toLocaleString('ru-RU')} ₽
            </Typography>
          </Box>
          <Button variant="contained" size="large" fullWidth sx={{ mt: 2 }}>
            Добавить в корзину
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

