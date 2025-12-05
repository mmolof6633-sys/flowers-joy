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

// Вспомогательная функция для получения ID категории (id или _id)
const getCategoryId = (category: ICategory | undefined): string | undefined => {
  if (!category) return undefined;
  return (category as any).id || (category as any)._id;
};

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
    getCategoryId(initialCategory)
  );

  // Синхронизируем состояние с URL при изменении initialCategorySlug
  useEffect(() => {
    setSelectedCategoryId(getCategoryId(initialCategory));
  }, [initialCategory]);

  // Гидратируем начальные данные в React Query кеш
  useEffect(() => {
    console.log('Categories received:', categories);
    console.log('First category structure:', categories[0]);
    queryClient.setQueryData(['categories'], { data: categories });
    const initialCategoryId = getCategoryId(initialCategory);
    queryClient.setQueryData(['bouquets', { categoryId: initialCategoryId }], {
      data: initialBouquets,
    });
  }, [queryClient, categories, initialBouquets, initialCategory]);

  // Получаем категорию по выбранному ID
  const selectedCategory = useMemo(
    () =>
      selectedCategoryId
        ? categories.find((cat) => getCategoryId(cat) === selectedCategoryId)
        : undefined,
    [categories, selectedCategoryId]
  );

  // Обработчик изменения категории
  const handleCategoryChange = (categoryId: string | undefined) => {
    console.log('Category changed to:', categoryId);
    setSelectedCategoryId(categoryId);
    const category = categoryId ? categories.find((cat) => cat.id === categoryId) : undefined;
    const newPath = category ? `/catalog/${category.slug}` : '/catalog';
    // Обновляем URL без перезагрузки страницы
    window.history.pushState({}, '', newPath);
  };

  // Загружаем букеты с учетом выбранной категории
  const initialCategoryId = getCategoryId(initialCategory);
  const isInitialCategory = selectedCategoryId === initialCategoryId;
  const { data: bouquetsData, isLoading } = useQuery<IApiResponse<IBouquet[]>>({
    queryKey: ['bouquets', { categoryId: selectedCategoryId }],
    queryFn: async () => {
      console.log('Fetching bouquets for category:', selectedCategoryId);
      // Вычисляем категорию внутри queryFn для актуальных данных
      const category = selectedCategoryId
        ? categories.find((cat) => getCategoryId(cat) === selectedCategoryId)
        : undefined;
      const queryParams = category?.slug ? `?category=${category.slug}` : '';
      const url = `/bouquets${queryParams}`;
      console.log('Fetching from URL:', url);
      const response = await apiClient.get<{ success: boolean; data: IBouquet[] }>(url);
      console.log('Response received:', response);
      return { data: response.data || [] };
    },
    initialData: isInitialCategory ? { data: initialBouquets } : undefined,
    enabled: true, // Всегда включен
  });

  const bouquets = bouquetsData?.data || initialBouquets;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Каталог
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <CatalogFilters
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={handleCategoryChange}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          {isLoading ? (
            <Typography>Загрузка...</Typography>
          ) : bouquets.length === 0 ? (
            <Typography>Букеты не найдены</Typography>
          ) : (
            <Grid container spacing={3}>
              {bouquets.map((bouquet) => (
                <Grid item xs={12} sm={6} key={bouquet.id}>
                  <BouquetCard bouquet={bouquet} />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
