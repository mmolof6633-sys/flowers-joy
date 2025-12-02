import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@shared/api/client';
import { IApiResponse } from '@shared/api/types';
import { ICategory } from '@entities/category';

export function useGetCategoriesQuery() {
  return useQuery<IApiResponse<ICategory[]>>({
    queryKey: ['categories'],
    queryFn: async () => {
      return apiClient.get<IApiResponse<ICategory[]>>('/categories');
    },
  });
}
