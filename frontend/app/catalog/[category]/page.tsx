import { CatalogPage } from '@pages/catalog';

interface PageProps {
  params: {
    category: string;
  };
}

export default function Page({ params }: PageProps) {
  return <CatalogPage categorySlug={params.category} />;
}
