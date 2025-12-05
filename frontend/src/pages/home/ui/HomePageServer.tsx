import { HomePageClient } from './HomePageClient';
import { getRecommendedBouquets, getCategories } from '@shared/api/server';

export async function HomePageServer() {
  // Загружаем рекомендуемые букеты на сервере
  const recommendedBouquetsResponse = await getRecommendedBouquets(8);
  const recommendedBouquets = recommendedBouquetsResponse.data || [];

  // Загружаем категории на сервере
  const categoriesResponse = await getCategories();
  const categories = categoriesResponse.data || [];

  return <HomePageClient initialRecommendedBouquets={recommendedBouquets} initialCategories={categories} />;
}
