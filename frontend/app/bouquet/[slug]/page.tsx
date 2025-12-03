import { BouquetPageServer } from '@pages/bouquet/ui/BouquetPageServer';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function Page({ params }: PageProps) {
  return <BouquetPageServer bouquetSlug={params.slug} />;
}
