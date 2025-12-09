'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Chip,
  Stack,
  Divider,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { IBouquet, IPopulatedCategory } from '@shared/api/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAddToCartMutation } from '@features/cart';

interface BouquetClientProps {
  bouquet: IBouquet;
}

export function BouquetClient({ bouquet }: BouquetClientProps) {
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const addToCartMutation = useAddToCartMutation();

  const handleAddToCart = async () => {
    if (!bouquet.id && !bouquet._id) return;

    try {
      await addToCartMutation.mutateAsync({
        bouquetId: bouquet.id || bouquet._id || '',
        quantity: 1,
      });
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Ошибка при добавлении в корзину:', error);
    }
  };

  // Получаем изображения
  const images =
    bouquet.images && bouquet.images.length > 0
      ? bouquet.images
      : bouquet.imageUrl
        ? [bouquet.imageUrl]
        : [];

  // Получаем категории (могут быть объектами после populate)
  const categories: IPopulatedCategory[] = Array.isArray(bouquet.categoryIds)
    ? bouquet.categoryIds.filter(
        (cat): cat is IPopulatedCategory => typeof cat === 'object' && cat !== null && 'name' in cat
      )
    : [];

  const handleCategoryClick = (categorySlug: string) => {
    router.push(`/catalog/${categorySlug}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <IconButton onClick={() => router.back()} sx={{ mb: 2 }} aria-label="назад">
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Grid container spacing={4}>
        {/* Галерея изображений */}
        <Grid item xs={12} md={6}>
          {images.length > 0 ? (
            <Box>
              {/* Главное изображение */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4/5',
                  borderRadius: 2,
                  overflow: 'hidden',
                  mb: 2,
                  bgcolor: 'grey.100',
                }}
              >
                <Image
                  src={images[selectedImageIndex]}
                  alt={`${bouquet.name} - изображение ${selectedImageIndex + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </Box>

              {/* Миниатюры (если больше одного изображения) */}
              {images.length > 1 && (
                <Grid container spacing={1}>
                  {images.map((image, index) => (
                    <Grid item xs={3} key={index}>
                      <Box
                        sx={{
                          position: 'relative',
                          width: '100%',
                          aspectRatio: '1',
                          borderRadius: 1,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: selectedImageIndex === index ? 2 : 1,
                          borderColor: selectedImageIndex === index ? 'primary.main' : 'divider',
                          '&:hover': {
                            borderColor: 'primary.main',
                          },
                        }}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <Image
                          src={image}
                          alt={`${bouquet.name} - миниатюра ${index + 1}`}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
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

        {/* Информация о букете */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {bouquet.name}
          </Typography>

          {/* Категории */}
          {categories.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Категории:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {categories.map((category) => (
                  <Chip
                    key={category.slug || category.id || category._id}
                    label={category.name}
                    onClick={() => handleCategoryClick(category.slug)}
                    clickable
                    size="small"
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Теги */}
          {bouquet.tags && bouquet.tags.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {bouquet.tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" variant="outlined" />
                ))}
              </Stack>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Цена */}
          <Box sx={{ my: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
              {bouquet.oldPrice && bouquet.oldPrice > bouquet.price && (
                <Typography
                  variant="h6"
                  sx={{
                    textDecoration: 'line-through',
                    color: 'text.secondary',
                  }}
                >
                  {bouquet.oldPrice.toLocaleString('ru-RU')} ₽
                </Typography>
              )}
              <Typography variant="h4" color="primary">
                {bouquet.price.toLocaleString('ru-RU')} ₽
              </Typography>
            </Stack>
          </Box>

          {/* Описание */}
          {bouquet.description && (
            <Box sx={{ my: 3 }}>
              <Typography variant="h6" gutterBottom>
                Описание
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {bouquet.description}
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Статус наличия */}
          <Box sx={{ mb: 3 }}>
            <Chip
              label={bouquet.inStock !== false ? 'В наличии' : 'Нет в наличии'}
              color={bouquet.inStock !== false ? 'success' : 'default'}
              sx={{ mb: 2 }}
            />
          </Box>

          {/* Кнопка добавления в корзину */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{ mt: 2 }}
            disabled={bouquet.inStock === false || addToCartMutation.isPending}
            onClick={handleAddToCart}
          >
            {addToCartMutation.isPending
              ? 'Добавление...'
              : bouquet.inStock !== false
                ? 'Добавить в корзину'
                : 'Нет в наличии'}
          </Button>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          Товар добавлен в корзину!
        </Alert>
      </Snackbar>
    </Container>
  );
}
