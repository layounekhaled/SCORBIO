import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import CheckoutPageClient from '@/components/checkout/CheckoutPageClient';

interface CheckoutPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string }>;
}

export async function generateMetadata({ params }: CheckoutPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });

  if (!product) {
    return { title: 'Produit non trouvé | SCORBIO' };
  }

  return {
    title: `Commander ${product.name} | SCORBIO`,
    description: `Commandez ${product.name} - ${product.tagline}. Livraison partout en Algérie, paiement à la livraison.`,
  };
}

export default async function CheckoutPage({ params, searchParams }: CheckoutPageProps) {
  const { slug } = await params;
  const { ref } = await searchParams;
  const product = await db.product.findUnique({ where: { slug } });

  if (!product || !product.active) {
    notFound();
  }

  const productData = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    tagline: product.tagline,
    price: product.price,
    originalPrice: product.originalPrice,
    imageUrl: product.imageUrl,
    stock: product.stock,
  };

  return <CheckoutPageClient product={productData} affiliateCode={ref || null} />;
}
