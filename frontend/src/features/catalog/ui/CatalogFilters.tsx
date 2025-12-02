'use client';

import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
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
  return (
    <Box sx={{ minWidth: 200, mb: 3 }}>
      <FormControl fullWidth>
        <InputLabel id="category-filter-label">Категория</InputLabel>
        <Select
          labelId="category-filter-label"
          id="category-filter"
          value={selectedCategoryId || ''}
          label="Категория"
          onChange={(e) => onCategoryChange(e.target.value || undefined)}
        >
          <MenuItem value="">Все категории</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
