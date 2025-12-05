'use client';

import { Container, Typography, Box, Grid } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useGetRecommendedBouquetsQuery, useGetCategoriesQuery } from '@features/catalog';
import { BouquetCard } from '@entities/bouquet';
import { IBouquet } from '@entities/bouquet';
import { CategoryCard, ICategory } from '@entities/category';
import { useEffect } from 'react';
import Image from 'next/image';
import mainImage from '@shared/assets/image/main.webp';
import { Carousel } from '@shared/ui';

interface HomePageClientProps {
  initialRecommendedBouquets: IBouquet[];
  initialCategories: ICategory[];
}

export function HomePageClient({ initialRecommendedBouquets, initialCategories }: HomePageClientProps) {
  const queryClient = useQueryClient();

  // Гидратируем начальные данные в React Query кеш
  useEffect(() => {
    queryClient.setQueryData(['bouquets', 'recommended', 8], {
      data: initialRecommendedBouquets,
    });
    queryClient.setQueryData(['categories'], {
      data: initialCategories,
    });
  }, [queryClient, initialRecommendedBouquets, initialCategories]);

  // Используем хуки для возможности обновления данных на клиенте
  const { data, isLoading } = useGetRecommendedBouquetsQuery(8);
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery();

  const bouquets = data?.data || initialRecommendedBouquets;
  const categories = categoriesData?.data || initialCategories;

  return (
    <>
      {/* Изображение во всю ширину под хедером */}
      <Box
        sx={{
          width: '100%',
          position: 'relative',
          height: { xs: '300px', sm: '400px', md: '600px', lg: '700px', xl: '800px' },
          overflow: 'hidden',
        }}
      >
        <Image
          src={mainImage}
          alt="Flowers Joy"
          fill
          priority
          style={{
            objectFit: 'cover',
          }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mt: 6, mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Рекомендуемые букеты
          </Typography>

          {isLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <Typography>Загрузка...</Typography>
            </Box>
          ) : bouquets.length > 0 ? (
            <Carousel maxItemsDesktop={4} spacing={3}>
              {bouquets.map((bouquet) => (
                <BouquetCard key={bouquet.id || bouquet._id} bouquet={bouquet} />
              ))}
            </Carousel>
          ) : (
            <Typography color="text.secondary">Рекомендуемые букеты пока не добавлены</Typography>
          )}
        </Box>

        <Box sx={{ mt: 8, mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Коллекции
          </Typography>

          {categoriesLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <Typography>Загрузка...</Typography>
            </Box>
          ) : categories.length > 0 ? (
            <Grid container spacing={3}>
              {categories.map((category) => (
                <Grid item xs={12} md={6} key={category.id}>
                  <CategoryCard category={category} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary">Категории пока не добавлены</Typography>
          )}
        </Box>
      </Container>
    </>
  );
}
