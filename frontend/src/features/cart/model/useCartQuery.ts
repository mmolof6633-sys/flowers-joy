import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@shared/api/client';
import { ICartResponse, ICartItemCountResponse } from '@shared/api/types';

// Получить корзину
export function useCartQuery() {
  return useQuery<ICartResponse>({
    queryKey: ['cart'],
    queryFn: async () => {
      return apiClient.get<ICartResponse>('/cart');
    },
  });
}

// Получить количество товаров в корзине
export function useCartItemCountQuery() {
  return useQuery<ICartItemCountResponse>({
    queryKey: ['cart', 'count'],
    queryFn: async () => {
      return apiClient.get<ICartItemCountResponse>('/cart/count');
    },
    refetchInterval: 30000, // Обновлять каждые 30 секунд
  });
}

// Добавить товар в корзину
export function useAddToCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bouquetId, quantity = 1 }: { bouquetId: string; quantity?: number }) => {
      return apiClient.post<ICartItemCountResponse>('/cart/items', {
        bouquetId,
        quantity,
      });
    },
    onSuccess: () => {
      // Инвалидируем запросы корзины
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

// Обновить количество товара в корзине
export function useUpdateCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bouquetId, quantity }: { bouquetId: string; quantity: number }) => {
      return apiClient.put(`/cart/items/${bouquetId}`, { quantity });
    },
    onSuccess: () => {
      // Инвалидируем запросы корзины
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

// Удалить товар из корзины
export function useRemoveFromCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bouquetId: string) => {
      return apiClient.delete(`/cart/items/${bouquetId}`);
    },
    onSuccess: () => {
      // Инвалидируем запросы корзины
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

// Очистить корзину
export function useClearCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return apiClient.delete('/cart');
    },
    onSuccess: () => {
      // Инвалидируем запросы корзины
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

