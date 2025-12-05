'use client';

import { Box, Typography, FormControl, Select, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import { ICategory } from '@entities/category';

interface CatalogFiltersProps {
  categories: ICategory[];
  selectedCategoryId?: string;
  onCategoryChange: (categoryId: string | undefined) => void;
}

export function CatalogFilters({
  categories,
  selectedCategoryId,
  onCategoryChange,
}: CatalogFiltersProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Вспомогательная функция для получения ID категории
  const getCategoryId = (category: ICategory): string => {
    return (category as any).id || (category as any)._id;
  };

  // Для селекта на мобильных
  if (isMobile) {
    return (
      <Box sx={{ width: '100%', mb: 3 }}>
        <FormControl fullWidth>
          <Select
            value={selectedCategoryId || ''}
            onChange={(e) => onCategoryChange(e.target.value || undefined)}
            displayEmpty
            sx={{
              '& .MuiSelect-select': {
                py: 1.5,
              },
            }}
          >
            <MenuItem value="">Все категории</MenuItem>
            {categories.map((category) => {
              const categoryId = getCategoryId(category);
              return (
                <MenuItem key={categoryId} value={categoryId}>
                  {category.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
    );
  }

  // Для десктопа - список категорий
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography
          onClick={() => onCategoryChange(undefined)}
          sx={{
            cursor: 'pointer',
            color: selectedCategoryId === undefined ? 'primary.main' : 'text.primary',
            fontWeight: selectedCategoryId === undefined ? 600 : 400,
            '&:hover': {
              color: 'primary.main',
            },
            transition: 'color 0.2s',
          }}
        >
          Все категории
        </Typography>
        {categories.map((category) => {
          const categoryId = getCategoryId(category);
          return (
            <Typography
              key={categoryId}
              onClick={() => {
                console.log(
                  'Category clicked:',
                  category.name,
                  'ID:',
                  categoryId,
                  'Full category:',
                  category
                );
                onCategoryChange(categoryId);
              }}
              sx={{
                cursor: 'pointer',
                color: selectedCategoryId === categoryId ? 'primary.main' : 'text.primary',
                fontWeight: selectedCategoryId === categoryId ? 600 : 400,
                '&:hover': {
                  color: 'primary.main',
                },
                transition: 'color 0.2s',
              }}
            >
              {category.name}
            </Typography>
          );
        })}
      </Box>
    </Box>
  );
}
