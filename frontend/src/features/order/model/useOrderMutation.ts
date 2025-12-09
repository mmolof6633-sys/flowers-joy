import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@shared/api/client';
import { IOrderResponse, ICreateOrderData } from '@shared/api/types';

// Создать заказ
export function useCreateOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ICreateOrderData) => {
      return apiClient.post<IOrderResponse>('/orders', data);
    },
    onSuccess: () => {
      // Инвалидируем запросы корзины и заказов
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

