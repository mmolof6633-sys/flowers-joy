'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import { useCartQuery } from '@features/cart';
import { useCreateOrderMutation } from '@features/order';
import { ICreateOrderData } from '@shared/api/types';

// Генерация времени доставки (8:00 - 20:00, интервал 2 часа)
const generateDeliveryTimes = () => {
  const times = [];
  for (let hour = 8; hour <= 20; hour += 2) {
    const timeString = `${hour.toString().padStart(2, '0')}:00`;
    times.push(timeString);
  }
  return times;
};

const deliveryTimes = generateDeliveryTimes();

export function CheckoutPageClient() {
  const router = useRouter();
  const { data: cartData, isLoading: cartLoading } = useCartQuery();
  const createOrderMutation = useCreateOrderMutation();

  const [formData, setFormData] = useState<ICreateOrderData>({
    customerInfo: {
      name: '',
      phone: '',
      email: '',
      comment: '',
    },
    recipientInfo: {
      isDifferentPerson: false,
      name: '',
      phone: '',
    },
    card: {
      enabled: false,
      text: '',
    },
    isAnonymous: false,
    askRecipientForDelivery: false,
    deliveryAddress: {
      street: '',
      house: '',
      apartment: '',
      entrance: '',
      floor: '',
      intercom: '',
      comment: '',
    },
    deliveryDate: undefined,
    deliveryTime: '',
    deliveryMethod: 'courier',
    paymentMethod: 'card',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);

  const cart = cartData?.data;

  // Проверяем, есть ли товары в корзине
  useEffect(() => {
    if (!cartLoading && (!cart || cart.items.length === 0)) {
      router.push('/cart');
    }
  }, [cart, cartLoading, router]);

  const handleInputChange = (field: string, value: any) => {
    const keys = field.split('.');
    setFormData((prev) => {
      const newData = { ...prev };
      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Валидация данных покупателя
    if (!formData.customerInfo.name.trim()) {
      newErrors['customerInfo.name'] = 'Имя обязательно';
    }
    if (!formData.customerInfo.phone.trim()) {
      newErrors['customerInfo.phone'] = 'Телефон обязателен';
    }
    if (!formData.customerInfo.email.trim()) {
      newErrors['customerInfo.email'] = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerInfo.email)) {
      newErrors['customerInfo.email'] = 'Некорректный email';
    }

    // Валидация данных получателя (если другой человек)
    if (formData.recipientInfo.isDifferentPerson) {
      if (!formData.recipientInfo.name?.trim()) {
        newErrors['recipientInfo.name'] = 'Имя получателя обязательно';
      }
      if (!formData.recipientInfo.phone?.trim()) {
        newErrors['recipientInfo.phone'] = 'Телефон получателя обязателен';
      }
    }

    // Валидация данных доставки (если не нужно уточнять у получателя)
    if (!formData.askRecipientForDelivery) {
      if (formData.deliveryMethod === 'courier') {
        if (!formData.deliveryAddress?.street?.trim()) {
          newErrors['deliveryAddress.street'] = 'Улица обязательна';
        }
        if (!formData.deliveryAddress?.house?.trim()) {
          newErrors['deliveryAddress.house'] = 'Дом обязателен';
        }
        if (!deliveryDate) {
          newErrors['deliveryDate'] = 'Дата доставки обязательна';
        }
        if (!formData.deliveryTime) {
          newErrors['deliveryTime'] = 'Время доставки обязательно';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const orderData: ICreateOrderData = {
        ...formData,
        deliveryDate: deliveryDate ? deliveryDate.toISOString() : undefined,
      };

      const response = await createOrderMutation.mutateAsync(orderData);
      
      // Перенаправляем на страницу успешного оформления заказа
      const orderId = response.data._id || response.data.id || response.data.orderNumber;
      router.push(`/order-success/${orderId}`);
    } catch (error: any) {
      console.error('Ошибка при создании заказа:', error);
    }
  };

  if (cartLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return null;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Оформление заказа
        </Typography>

        {createOrderMutation.isError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Ошибка при оформлении заказа. Попробуйте еще раз.
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Данные покупателя */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Данные покупателя
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    label="Имя *"
                    fullWidth
                    value={formData.customerInfo.name}
                    onChange={(e) => handleInputChange('customerInfo.name', e.target.value)}
                    error={!!errors['customerInfo.name']}
                    helperText={errors['customerInfo.name']}
                    required
                  />
                  <TextField
                    label="Телефон *"
                    fullWidth
                    value={formData.customerInfo.phone}
                    onChange={(e) => handleInputChange('customerInfo.phone', e.target.value)}
                    error={!!errors['customerInfo.phone']}
                    helperText={errors['customerInfo.phone']}
                    required
                  />
                  <TextField
                    label="Email *"
                    type="email"
                    fullWidth
                    value={formData.customerInfo.email}
                    onChange={(e) => handleInputChange('customerInfo.email', e.target.value)}
                    error={!!errors['customerInfo.email']}
                    helperText={errors['customerInfo.email']}
                    required
                  />
                  <TextField
                    label="Комментарии к заказу"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.customerInfo.comment || ''}
                    onChange={(e) => handleInputChange('customerInfo.comment', e.target.value)}
                  />
                </Stack>
              </Paper>
            </Grid>

            {/* Данные получателя */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Данные получателя
                </Typography>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.recipientInfo.isDifferentPerson}
                        onChange={(e) =>
                          handleInputChange('recipientInfo.isDifferentPerson', e.target.checked)
                        }
                      />
                    }
                    label="Получатель другой человек"
                  />

                  {formData.recipientInfo.isDifferentPerson && (
                    <>
                      <TextField
                        label="Имя получателя *"
                        fullWidth
                        value={formData.recipientInfo.name || ''}
                        onChange={(e) => handleInputChange('recipientInfo.name', e.target.value)}
                        error={!!errors['recipientInfo.name']}
                        helperText={errors['recipientInfo.name']}
                        required
                      />
                      <TextField
                        label="Телефон получателя *"
                        fullWidth
                        value={formData.recipientInfo.phone || ''}
                        onChange={(e) => handleInputChange('recipientInfo.phone', e.target.value)}
                        error={!!errors['recipientInfo.phone']}
                        helperText={errors['recipientInfo.phone']}
                        required
                      />
                    </>
                  )}

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.card.enabled}
                        onChange={(e) =>
                          handleInputChange('card.enabled', e.target.checked)
                        }
                      />
                    }
                    label="Открытка"
                  />

                  {formData.card.enabled && (
                    <TextField
                      label="Текст открытки"
                      fullWidth
                      multiline
                      rows={3}
                      value={formData.card.text || ''}
                      onChange={(e) => handleInputChange('card.text', e.target.value)}
                    />
                  )}

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.isAnonymous}
                        onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                      />
                    }
                    label="Анонимно"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.askRecipientForDelivery}
                        onChange={(e) =>
                          handleInputChange('askRecipientForDelivery', e.target.checked)
                        }
                      />
                    }
                    label="Уточнить информацию о доставке у получателя"
                  />
                </Stack>
              </Paper>
            </Grid>

            {/* Данные доставки */}
            {!formData.askRecipientForDelivery && (
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Данные доставки
                  </Typography>
                  <Stack spacing={2}>
                    <FormControl fullWidth>
                      <InputLabel>Способ доставки</InputLabel>
                      <Select
                        value={formData.deliveryMethod}
                        label="Способ доставки"
                        onChange={(e) =>
                          handleInputChange('deliveryMethod', e.target.value)
                        }
                      >
                        <MenuItem value="pickup">Самовывоз</MenuItem>
                        <MenuItem value="courier">Курьер (бесплатно)</MenuItem>
                      </Select>
                    </FormControl>

                    {formData.deliveryMethod === 'courier' && (
                      <>
                        <DatePicker
                          label="Дата доставки *"
                          value={deliveryDate}
                          onChange={(date) => {
                            setDeliveryDate(date);
                            if (errors['deliveryDate']) {
                              setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors['deliveryDate'];
                                return newErrors;
                              });
                            }
                          }}
                          minDate={new Date()}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors['deliveryDate'],
                              helperText: errors['deliveryDate'],
                            },
                          }}
                        />

                        <FormControl fullWidth error={!!errors['deliveryTime']}>
                          <InputLabel>Время доставки *</InputLabel>
                          <Select
                            value={formData.deliveryTime}
                            label="Время доставки *"
                            onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
                          >
                            {deliveryTimes.map((time) => (
                              <MenuItem key={time} value={time}>
                                {time}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors['deliveryTime'] && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                              {errors['deliveryTime']}
                            </Typography>
                          )}
                        </FormControl>

                        <TextField
                          label="Улица *"
                          fullWidth
                          value={formData.deliveryAddress?.street || ''}
                          onChange={(e) =>
                            handleInputChange('deliveryAddress.street', e.target.value)
                          }
                          error={!!errors['deliveryAddress.street']}
                          helperText={errors['deliveryAddress.street']}
                          required
                        />
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              label="Дом *"
                              fullWidth
                              value={formData.deliveryAddress?.house || ''}
                              onChange={(e) =>
                                handleInputChange('deliveryAddress.house', e.target.value)
                              }
                              error={!!errors['deliveryAddress.house']}
                              helperText={errors['deliveryAddress.house']}
                              required
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              label="Квартира"
                              fullWidth
                              value={formData.deliveryAddress?.apartment || ''}
                              onChange={(e) =>
                                handleInputChange('deliveryAddress.apartment', e.target.value)
                              }
                            />
                          </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <TextField
                              label="Подъезд"
                              fullWidth
                              value={formData.deliveryAddress?.entrance || ''}
                              onChange={(e) =>
                                handleInputChange('deliveryAddress.entrance', e.target.value)
                              }
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <TextField
                              label="Этаж"
                              fullWidth
                              value={formData.deliveryAddress?.floor || ''}
                              onChange={(e) =>
                                handleInputChange('deliveryAddress.floor', e.target.value)
                              }
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <TextField
                              label="Домофон"
                              fullWidth
                              value={formData.deliveryAddress?.intercom || ''}
                              onChange={(e) =>
                                handleInputChange('deliveryAddress.intercom', e.target.value)
                              }
                            />
                          </Grid>
                        </Grid>
                        <TextField
                          label="Комментарий к адресу"
                          fullWidth
                          multiline
                          rows={2}
                          value={formData.deliveryAddress?.comment || ''}
                          onChange={(e) =>
                            handleInputChange('deliveryAddress.comment', e.target.value)
                          }
                        />
                      </>
                    )}
                  </Stack>
                </Paper>
              </Grid>
            )}

            {/* Способ оплаты */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Способ оплаты
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={formData.paymentMethod}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  >
                    <MenuItem value="card">Картой</MenuItem>
                  </Select>
                </FormControl>
              </Paper>
            </Grid>

            {/* Итого */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
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
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending ? 'Оформление...' : 'Оплатить'}
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </form>
      </Container>
    </LocalizationProvider>
  );
}

