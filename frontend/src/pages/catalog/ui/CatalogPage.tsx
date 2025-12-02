'use client';

import { useState } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import { useGetBouquetsQuery, useGetCategoriesQuery, CatalogFilters } from '@features/catalog';
import { BouquetCard } from '@entities/bouquet';

export function CatalogPage({ categorySlug }: { categorySlug?: string }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();

  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: bouquetsData, isLoading } = useGetBouquetsQuery({
    categoryId: selectedCategoryId,
  });

  const categories = categoriesData?.data || [];
  const bouquets = bouquetsData?.data || [];

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
