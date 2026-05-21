import { Metadata } from 'next';
import CheckoutPageWrapper from '@/components/checkout/CheckoutPageWrapper';

export const metadata: Metadata = {
  title: 'Commander | SCORBIO',
  description: 'Commandez vos produits naturels SCORBIO. Livraison partout en Algérie, paiement à la livraison.',
};

export default function CheckoutPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ ref?: string }> }) {
  return <CheckoutPageWrapper slugPromise={params} refPromise={searchParams} />;
}
