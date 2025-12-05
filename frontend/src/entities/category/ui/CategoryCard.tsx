'use client';

import { Card, CardContent, Typography, CardActionArea, CardMedia } from '@mui/material';
import { ICategory } from '@entities/category';
import Link from 'next/link';

interface CategoryCardProps {
  category: ICategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea
        component={Link}
        href={`/catalog/${category.slug}`}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          flexGrow: 1,
        }}
      >
        {category.image && (
          <CardMedia
            component="img"
            height="200"
            image={category.image}
            alt={category.name}
            sx={{ objectFit: 'cover' }}
          />
        )}
        <CardContent
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: category.image ? 'auto' : '150px',
          }}
        >
          <Typography variant="h5" component="div" gutterBottom align="center">
            {category.name}
          </Typography>
          {category.description && (
            <Typography variant="body2" color="text.secondary" align="center">
              {category.description}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
