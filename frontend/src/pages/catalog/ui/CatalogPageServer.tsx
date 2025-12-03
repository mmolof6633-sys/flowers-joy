import { CatalogClient } from './CatalogClient';
import { getBouquets, getCategories } from '@shared/api/server';

interface CatalogPageServerProps {
  categorySlug?: string;
}

export async function CatalogPageServer({ categorySlug }: CatalogPageServerProps) {
  // Загружаем данные на сервере
  const [categoriesResponse, bouquetsResponse] = await Promise.all([
    getCategories(),
    getBouquets(categorySlug ? { category: categorySlug } : undefined),
  ]);

  const categories = categoriesResponse.data || [];
  const bouquets = bouquetsResponse.data || [];

  return (
    <CatalogClient
      initialBouquets={bouquets}
      categories={categories}
      initialCategorySlug={categorySlug}
    />
  );
}

