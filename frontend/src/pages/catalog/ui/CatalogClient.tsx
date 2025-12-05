'use client';

import { useState, useMemo, useEffect } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, usePathname } from 'next/navigation';
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
  const router = useRouter();
  const pathname = usePathname();
  
  // Получаем текущий slug из URL (приоритет) или из пропсов
  const currentCategorySlug = useMemo(() => {
    // Извлекаем slug из пути /catalog/[category]
    const match = pathname?.match(/^\/catalog\/([^/]+)$/);
    const slugFromPath = match ? match[1] : undefined;
    // Используем slug из пути, если он есть, иначе из пропсов
    return slugFromPath || initialCategorySlug;
  }, [pathname, initialCategorySlug]);
  
  const currentCategory = useMemo(
    () => categories.find((cat) => cat.slug === currentCategorySlug),
    [categories, currentCategorySlug]
  );
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(
    getCategoryId(currentCategory)
  );

  // Синхронизируем состояние с URL при изменении currentCategorySlug
  useEffect(() => {
    const category = categories.find((cat) => cat.slug === currentCategorySlug);
    setSelectedCategoryId(getCategoryId(category));
  }, [currentCategorySlug, categories]);

  // Инвалидируем кеш при изменении категории для принудительного обновления данных
  useEffect(() => {
    console.log('Current category slug changed to:', currentCategorySlug);
    // Инвалидируем запросы для текущей категории, чтобы гарантировать обновление
    queryClient.invalidateQueries({ 
      queryKey: ['bouquets', { categorySlug: currentCategorySlug }] 
    });
  }, [currentCategorySlug, queryClient]);

  // Гидратируем начальные данные в React Query кеш
  useEffect(() => {
    console.log('Categories received:', categories);
    console.log('First category structure:', categories[0]);
    queryClient.setQueryData(['categories'], { data: categories });
    // Гидратируем данные только для начальной категории
    if (currentCategorySlug === initialCategorySlug) {
      queryClient.setQueryData(['bouquets', { categorySlug: currentCategorySlug }], {
        data: initialBouquets,
      });
    }
  }, [queryClient, categories, initialBouquets, currentCategorySlug, initialCategorySlug]);

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
    const category = categoryId
      ? categories.find((cat) => getCategoryId(cat) === categoryId)
      : undefined;
    const newPath = category ? `/catalog/${category.slug}` : '/catalog';
    // Инвалидируем кеш для всех запросов букетов перед навигацией
    queryClient.invalidateQueries({ queryKey: ['bouquets'] });
    // Используем Next.js роутер для навигации
    // Состояние обновится автоматически через pathname
    router.push(newPath);
  };

  // Загружаем букеты с учетом выбранной категории
  // Используем currentCategorySlug напрямую для синхронизации с URL
  const { data: bouquetsData, isLoading } = useQuery<IApiResponse<IBouquet[]>>({
    queryKey: ['bouquets', { categorySlug: currentCategorySlug }],
    queryFn: async () => {
      console.log('Fetching bouquets for category slug:', currentCategorySlug);
      const queryParams = currentCategorySlug ? `?category=${currentCategorySlug}` : '';
      const url = `/bouquets${queryParams}`;
      console.log('Fetching from URL:', url);
      const response = await apiClient.get<{ success: boolean; data: IBouquet[] }>(url);
      console.log('Response received:', response);
      return { data: response.data || [] };
    },
    // Используем initialData только если текущий slug совпадает с initialCategorySlug
    initialData: currentCategorySlug === initialCategorySlug ? { data: initialBouquets } : undefined,
    enabled: true, // Всегда включен
    refetchOnMount: 'always', // Всегда перезапрашиваем при монтировании
    staleTime: 0, // Данные сразу считаются устаревшими, чтобы гарантировать обновление
  });

  // Используем данные из React Query, если они есть, иначе initialBouquets только для начальной категории
  const bouquets = bouquetsData?.data ?? (currentCategorySlug === initialCategorySlug ? initialBouquets : []);

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
