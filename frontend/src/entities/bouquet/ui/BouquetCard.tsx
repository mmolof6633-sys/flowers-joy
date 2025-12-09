'use client';

import { Card, CardContent, CardMedia, Typography, Box, IconButton, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { IBouquet } from '@entities/bouquet';
import { useAddToCartMutation } from '@features/cart';

interface BouquetCardProps {
  bouquet: IBouquet;
}

export function BouquetCard({ bouquet }: BouquetCardProps) {
  const router = useRouter();
  const addToCartMutation = useAddToCartMutation();
  const [isAdding, setIsAdding] = useState(false);

  // Получаем slug для навигации (slug или id как fallback)
  const bouquetSlug = bouquet.slug || bouquet.id || bouquet._id;

  const handleClick = () => {
    if (bouquetSlug) {
      router.push(`/bouquet/${bouquetSlug}`);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем переход на страницу букета
    if (!bouquet.id && !bouquet._id) return;

    setIsAdding(true);
    try {
      await addToCartMutation.mutateAsync({
        bouquetId: bouquet.id || bouquet._id || '',
        quantity: 1,
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card
      sx={{
        cursor: bouquetSlug ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': bouquetSlug
          ? {
              transform: 'translateY(-4px)',
              boxShadow: 4,
            }
          : {},
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
        <Box mt={2} display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
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
          <Tooltip title="Добавить в корзину">
            <IconButton
              color="primary"
              onClick={handleAddToCart}
              disabled={isAdding || bouquet.inStock === false || addToCartMutation.isPending}
              aria-label="добавить в корзину"
            >
              <ShoppingCartIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}
