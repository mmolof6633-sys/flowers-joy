'use client';

import { Container, Typography, Box } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useGetRecommendedBouquetsQuery } from '@features/catalog';
import { BouquetCard } from '@entities/bouquet';
import { IBouquet } from '@entities/bouquet';
import { useEffect } from 'react';
import Image from 'next/image';
import mainImage from '@shared/assets/image/main.webp';
import { Carousel } from '@shared/ui';

interface HomePageClientProps {
  initialRecommendedBouquets: IBouquet[];
}

export function HomePageClient({ initialRecommendedBouquets }: HomePageClientProps) {
  const queryClient = useQueryClient();

  // Гидратируем начальные данные в React Query кеш
  useEffect(() => {
    queryClient.setQueryData(['bouquets', 'recommended', 8], {
      data: initialRecommendedBouquets,
    });
  }, [queryClient, initialRecommendedBouquets]);

  // Используем хук для возможности обновления данных на клиенте
  const { data, isLoading } = useGetRecommendedBouquetsQuery(8);

  const bouquets = data?.data || initialRecommendedBouquets;

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
      </Container>
    </>
  );
}
