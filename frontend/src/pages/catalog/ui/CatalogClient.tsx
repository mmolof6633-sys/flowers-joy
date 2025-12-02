'use client';

import { useState, useMemo, useEffect } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CatalogFilters } from '@features/catalog';
import { BouquetCard } from '@entities/bouquet';
import { IBouquet } from '@entities/bouquet';
import { ICategory } from '@entities/category';
import { apiClient } from '@shared/api/client';
import { IApiResponse } from '@shared/api/types';

interface CatalogClientProps {
  initialBouquets: IBouquet[];
  categories: ICategory[];
  initialCategorySlug?: string;
}

export function CatalogClient({
  initialBouquets,
  categories,
  initialCategorySlug,
}: CatalogClientProps) {
  const queryClient = useQueryClient();
  const initialCategory = useMemo(
    () => categories.find((cat) => cat.slug === initialCategorySlug),
    [categories, initialCategorySlug]
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(
    initialCategory?.id
  );

  // Гидратируем начальные данные в React Query кеш
  useEffect(() => {
    queryClient.setQueryData(['categories'], { data: categories });
    queryClient.setQueryData(['bouquets', { categoryId: initialCategory?.id }], {
      data: initialBouquets,
    });
  }, [queryClient, categories, initialBouquets, initialCategory?.id]);

  // Получаем категорию по выбранному ID
  const selectedCategory = useMemo(
    () =>
      selectedCategoryId ? categories.find((cat) => cat.id === selectedCategoryId) : undefined,
    [categories, selectedCategoryId]
  );

  // Загружаем букеты с учетом выбранной категории
  const { data: bouquetsData, isLoading } = useQuery<IApiResponse<IBouquet[]>>({
    queryKey: ['bouquets', { categoryId: selectedCategoryId }],
    queryFn: async () => {
      const category = selectedCategory;
      const queryParams = category?.slug ? `?category=${category.slug}` : '';
      const response = await apiClient.get<{ success: boolean; data: IBouquet[] }>(
        `/bouquets${queryParams}`
      );
      return { data: response.data || [] };
    },
    initialData: selectedCategoryId === initialCategory?.id ? { data: initialBouquets } : undefined,
    enabled: selectedCategoryId !== initialCategory?.id, // Загружаем только если категория изменилась
  });

  const bouquets = bouquetsData?.data || initialBouquets;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Каталог
      </Typography>
      <CatalogFilters
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={setSelectedCategoryId}
      />
      {isLoading ? (
        <Typography>Загрузка...</Typography>
      ) : bouquets.length === 0 ? (
        <Typography>Букеты не найдены</Typography>
      ) : (
        <Grid container spacing={3}>
          {bouquets.map((bouquet) => (
            <Grid item xs={12} sm={6} md={4} key={bouquet.id}>
              <BouquetCard bouquet={bouquet} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
