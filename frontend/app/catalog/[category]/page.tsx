import { CatalogPageServer } from '@pages/catalog/ui/CatalogPageServer';

interface PageProps {
  params: {
    category: string;
  };
}

export default function Page({ params }: PageProps) {
  return <CatalogPageServer categorySlug={params.category} />;
}
