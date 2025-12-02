import { BouquetPageServer } from '@pages/bouquet/ui/BouquetPageServer';

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <BouquetPageServer bouquetId={params.id} />;
}
