import { HomePageClient } from './HomePageClient';
import { getRecommendedBouquets } from '@shared/api/server';

export async function HomePageServer() {
  // Загружаем рекомендуемые букеты на сервере
  const recommendedBouquetsResponse = await getRecommendedBouquets(8);
  const recommendedBouquets = recommendedBouquetsResponse.data || [];

  return <HomePageClient initialRecommendedBouquets={recommendedBouquets} />;
}
