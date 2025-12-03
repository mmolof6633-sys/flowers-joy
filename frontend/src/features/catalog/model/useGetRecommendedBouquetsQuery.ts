import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@shared/api/client';
import { IApiResponse } from '@shared/api/types';
import { IBouquet } from '@entities/bouquet';

interface ApiResponse {
  success: boolean;
  data: IBouquet[];
}

export function useGetRecommendedBouquetsQuery(limit: number = 8) {
  return useQuery<IApiResponse<IBouquet[]>>({
    queryKey: ['bouquets', 'recommended', limit],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse>(`/bouquets/recommended?limit=${limit}`);
      return { data: response.data || [] };
    },
  });
}
