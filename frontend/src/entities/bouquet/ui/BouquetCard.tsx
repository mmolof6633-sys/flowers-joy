'use client';

import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { IBouquet } from '@entities/bouquet';

interface BouquetCardProps {
  bouquet: IBouquet;
}

export function BouquetCard({ bouquet }: BouquetCardProps) {
  return (
    <Card>
      {(bouquet.images?.[0] || bouquet.imageUrl) && (
        <CardMedia
          component="img"
          height="200"
          image={bouquet.images?.[0] || bouquet.imageUrl}
          alt={bouquet.name}
        />
      )}
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {bouquet.name}
        </Typography>
        {bouquet.description && (
          <Typography variant="body2" color="text.secondary" paragraph>
            {bouquet.description}
          </Typography>
        )}
        <Box mt={2}>
          <Typography variant="h6" color="primary">
            {bouquet.price} ₽
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

