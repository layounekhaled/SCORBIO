import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductPageClient from '@/components/product/ProductPageClient';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });

  if (!product) {
    return { title: 'Produit non trouvé | SCORBIO' };
  }

  return {
    title: `${product.name} - ${product.tagline} | SCORBIO`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | SCORBIO`,
      description: product.tagline,
      images: [product.imageUrl],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });

  if (!product || !product.active) {
    notFound();
  }

  const relatedProducts = await db.product.findMany({
    where: {
      category: product.category,
      active: true,
      id: { not: product.id },
    },
    orderBy: { orderIndex: 'asc' },
    take: 4,
  });

  const productData = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    tagline: product.tagline,
    description: product.description,
    problemText: product.problemText,
    solutionText: product.solutionText,
    benefits: product.benefits,
    usage: product.usage,
    price: product.price,
    originalPrice: product.originalPrice,
    imageUrl: product.imageUrl,
    category: product.category,
    stock: product.stock,
  };

  const relatedData = relatedProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    price: p.price,
    originalPrice: p.originalPrice,
    imageUrl: p.imageUrl,
  }));

  return <ProductPageClient product={productData} relatedProducts={relatedData} />;
}
