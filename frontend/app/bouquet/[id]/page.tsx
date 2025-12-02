import { BouquetPage } from '@pages/bouquet';

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <BouquetPage bouquetId={params.id} />;
}
