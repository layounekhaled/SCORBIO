import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import CheckoutPageClient from '@/components/checkout/CheckoutPageClient';

export const dynamic = 'force-dynamic'

interface CheckoutPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string }>;
}

// Fallback checkout product data
const fallbackCheckoutProducts: Record<string, {
  id: string; slug: string; name: string; tagline: string;
  price: number; originalPrice: number | null; imageUrl: string; stock: number;
}> = {
  acneline: { id: '1', slug: 'acneline', name: 'Acnéline', tagline: 'Votre solution naturelle contre l\'acné', price: 3900, originalPrice: 5500, imageUrl: '/products/acneline.png', stock: 150 },
  colonclean: { id: '2', slug: 'colonclean', name: 'ColonClean', tagline: 'Détoxifiez votre système digestif naturellement', price: 3500, originalPrice: 4800, imageUrl: '/products/colonclean.png', stock: 200 },
  cleanlungs: { id: '3', slug: 'cleanlungs', name: 'CleanLungs', tagline: 'Respirez librement, vivez pleinement', price: 3700, originalPrice: 5000, imageUrl: '/products/cleanlungs.png', stock: 120 },
  maca: { id: '4', slug: 'maca', name: 'Maca Power', tagline: 'L\'énergie naturelle du Pérou pour votre vitalité', price: 4200, originalPrice: 5900, imageUrl: '/products/maca.png', stock: 180 },
}

export async function generateMetadata({ params }: CheckoutPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await db.product.findUnique({ where: { slug } });
    if (product) {
      return {
        title: `Commander ${product.name} | SCORBIO`,
        description: `Commandez ${product.name} - ${product.tagline}. Livraison partout en Algérie, paiement à la livraison.`,
      };
    }
  } catch (error) {
    console.error('Metadata fetch error:', error);
  }

  const fallback = fallbackCheckoutProducts[slug];
  if (fallback) {
    return {
      title: `Commander ${fallback.name} | SCORBIO`,
      description: `Commandez ${fallback.name} - ${fallback.tagline}. Livraison partout en Algérie, paiement à la livraison.`,
    };
  }

  return { title: 'Produit non trouvé | SCORBIO' };
}

export default async function CheckoutPage({ params, searchParams }: CheckoutPageProps) {
  const { slug } = await params;
  const { ref } = await searchParams;
  let product = null;

  try {
    product = await db.product.findUnique({ where: { slug } });
  } catch (error) {
    console.error('Checkout product fetch error, using fallback:', error);
  }

  // Use fallback if DB is unavailable
  if (!product) {
    product = fallbackCheckoutProducts[slug] || null;
  }

  if (!product) {
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
