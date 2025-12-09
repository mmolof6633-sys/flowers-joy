'use client';

import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  IconButton,
  TextField,
  Divider,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import {
  useCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} from '@features/cart';

export function CartPageClient() {
  const router = useRouter();
  const { data, isLoading, error } = useCartQuery();
  const updateMutation = useUpdateCartItemMutation();
  const removeMutation = useRemoveFromCartMutation();
  const clearMutation = useClearCartMutation();

  const cart = data?.data;

  const handleQuantityChange = (bouquetId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      return;
    }
    updateMutation.mutate({ bouquetId, quantity: newQuantity });
  };

  const handleRemove = (bouquetId: string) => {
    removeMutation.mutate(bouquetId);
  };

  const handleClearCart = () => {
    if (window.confirm('Вы уверены, что хотите очистить корзину?')) {
      clearMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Ошибка при загрузке корзины</Alert>
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="400px"
          gap={2}
        >
          <ShoppingCartOutlinedIcon sx={{ fontSize: 80, color: 'text.secondary' }} />
          <Typography variant="h5" color="text.secondary">
            Ваша корзина пуста
          </Typography>
          <Button variant="contained" component={Link} href="/catalog" sx={{ mt: 2 }}>
            Перейти в каталог
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Корзина
        </Typography>
        {cart.items.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleClearCart}
            disabled={clearMutation.isPending}
          >
            Очистить корзину
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Список товаров */}
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            {cart.items.map((item) => (
              <Paper key={item.bouquetId} elevation={2} sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  {/* Изображение */}
                  <Grid item xs={12} sm={3}>
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '1',
                        borderRadius: 2,
                        overflow: 'hidden',
                        bgcolor: 'grey.100',
                      }}
                    >
                      {item.bouquet.images?.[0] && (
                        <Image
                          src={item.bouquet.images[0]}
                          alt={item.bouquet.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      )}
                    </Box>
                  </Grid>

                  {/* Информация о товаре */}
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="h6"
                      component={Link}
                      href={`/bouquet/${item.bouquet.slug || item.bouquetId}`}
                      sx={{
                        textDecoration: 'none',
                        color: 'inherit',
                        '&:hover': {
                          color: 'primary.main',
                        },
                        mb: 1,
                      }}
                    >
                      {item.bouquet.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {item.bouquet.price.toLocaleString('ru-RU')} ₽ за шт.
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {item.totalPrice.toLocaleString('ru-RU')} ₽
                    </Typography>
                  </Grid>

                  {/* Управление количеством и удаление */}
                  <Grid item xs={12} sm={3}>
                    <Box display="flex" flexDirection="column" alignItems="flex-end" gap={2}>
                      {/* Счетчик количества */}
                      <Box display="flex" alignItems="center" gap={1}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.bouquetId, item.quantity - 1)}
                          disabled={updateMutation.isPending || item.quantity <= 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value, 10);
                            if (!isNaN(newQuantity) && newQuantity > 0) {
                              handleQuantityChange(item.bouquetId, newQuantity);
                            }
                          }}
                          inputProps={{
                            min: 1,
                            style: { textAlign: 'center', width: '60px' },
                          }}
                          size="small"
                          disabled={updateMutation.isPending}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.bouquetId, item.quantity + 1)}
                          disabled={updateMutation.isPending}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>

                      {/* Кнопка удаления */}
                      <IconButton
                        color="error"
                        onClick={() => handleRemove(item.bouquetId)}
                        disabled={removeMutation.isPending}
                        aria-label="удалить"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Stack>
        </Grid>

        {/* Итоговая информация */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Итого
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body1">Товаров:</Typography>
              <Typography variant="body1">{cart.totalItems}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Сумма:</Typography>
              <Typography variant="h6" color="primary">
                {cart.totalPrice.toLocaleString('ru-RU')} ₽
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Button
              variant="contained"
              fullWidth
              size="large"
              component={Link}
              href="/checkout"
              disabled={cart.items.length === 0}
            >
              Оформить заказ
            </Button>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
              component={Link}
              href="/catalog"
            >
              Продолжить покупки
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
