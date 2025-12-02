import { notFound } from 'next/navigation';
import { getBouquetBySlug } from '@shared/api/server';
import { BouquetClient } from './BouquetClient';

interface BouquetPageServerProps {
  bouquetId: string;
}

export async function BouquetPageServer({ bouquetId }: BouquetPageServerProps) {
  // Загружаем букет на сервере
  // API использует slug, но может принимать и ID
  const bouquetResponse = await getBouquetBySlug(bouquetId);

  if (!bouquetResponse || !bouquetResponse.data) {
    notFound();
  }

  return <BouquetClient bouquet={bouquetResponse.data} />;
}

