'use client';

import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { IBouquet } from '@entities/bouquet';

interface BouquetCardProps {
  bouquet: IBouquet;
}

export function BouquetCard({ bouquet }: BouquetCardProps) {
  const router = useRouter();
  
  // Получаем slug для навигации (slug или id как fallback)
  const bouquetSlug = bouquet.slug || bouquet.id || bouquet._id;
  
  const handleClick = () => {
    if (bouquetSlug) {
      router.push(`/bouquet/${bouquetSlug}`);
    }
  };

  return (
    <Card
      sx={{
        cursor: bouquetSlug ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': bouquetSlug ? {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        } : {},
      }}
      onClick={handleClick}
    >
      {(bouquet.images?.[0] || bouquet.imageUrl) && (
        <CardMedia
          component="img"
          height="200"
          image={bouquet.images?.[0] || bouquet.imageUrl}
          alt={bouquet.name}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {bouquet.name}
        </Typography>
        {bouquet.description && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            paragraph
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {bouquet.description}
          </Typography>
        )}
        <Box mt={2} display="flex" alignItems="center" gap={1}>
          {bouquet.oldPrice && bouquet.oldPrice > bouquet.price && (
            <Typography
              variant="body2"
              sx={{
                textDecoration: 'line-through',
                color: 'text.secondary',
              }}
            >
              {bouquet.oldPrice.toLocaleString('ru-RU')} ₽
            </Typography>
          )}
          <Typography variant="h6" color="primary">
            {bouquet.price.toLocaleString('ru-RU')} ₽
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

