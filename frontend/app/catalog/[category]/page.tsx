import { CatalogPageServer } from '@pages/catalog/ui/CatalogPageServer';

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { category } = await params;
  return <CatalogPageServer categorySlug={category} />;
}
