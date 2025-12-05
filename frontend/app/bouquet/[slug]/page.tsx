import { BouquetPageServer } from '@pages/bouquet/ui/BouquetPageServer';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <BouquetPageServer bouquetSlug={slug} />;
}
