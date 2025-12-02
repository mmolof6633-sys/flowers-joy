import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@shared/api/client';
import { IApiResponse } from '@shared/api/types';
import { IBouquet } from '@entities/bouquet';

interface UseGetBouquetsQueryParams {
  categoryId?: string;
}

export function useGetBouquetsQuery(params?: UseGetBouquetsQueryParams) {
  return useQuery<IApiResponse<IBouquet[]>>({
    queryKey: ['bouquets', params],
    queryFn: async () => {
      const queryParams = params?.categoryId ? `?categoryId=${params.categoryId}` : '';
      return apiClient.get<IApiResponse<IBouquet[]>>(`/bouquets${queryParams}`);
    },
  });
}
