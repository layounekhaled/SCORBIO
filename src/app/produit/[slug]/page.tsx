import { Metadata } from 'next';
import ProductPageWrapper from '@/components/product/ProductPageWrapper';

export const metadata: Metadata = {
  title: 'Produit | SCORBIO',
  description: 'Découvrez nos produits naturels SCORBIO pour votre santé et beauté.',
};

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  return <ProductPageWrapper slugPromise={params} />;
}
