import { notFound } from 'next/navigation';
import { getBouquetBySlug } from '@shared/api/server';
import { BouquetClient } from './BouquetClient';

interface BouquetPageServerProps {
  bouquetSlug: string;
}

export async function BouquetPageServer({ bouquetSlug }: BouquetPageServerProps) {
  // Загружаем букет на сервере
  // API использует slug, но может принимать и ID
  const bouquetResponse = await getBouquetBySlug(bouquetSlug);

  if (!bouquetResponse || !bouquetResponse.data) {
    notFound();
  }

  return <BouquetClient bouquet={bouquetResponse.data} />;
}


