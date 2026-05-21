import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductPageClient from '@/components/product/ProductPageClient';

export const dynamic = 'force-dynamic'

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Fallback product data
const fallbackProducts: Record<string, {
  id: string; slug: string; name: string; tagline: string; description: string;
  problemText: string; solutionText: string; benefits: string; usage: string;
  price: number; originalPrice: number | null; imageUrl: string; category: string; stock: number;
}> = {
  acneline: {
    id: '1', slug: 'acneline', name: 'Acnéline',
    tagline: 'Votre solution naturelle contre l\'acné',
    description: 'Acnéline est une huile naturelle formulée avec des ingrédients soigneusement sélectionnés pour combattre l\'acné efficacement. Notre formule unique pénètre profondément les pores pour éliminer les bactéries responsables de l\'acné tout en nourrissant et en hydratant votre peau.',
    problemText: 'L\'acné touche des millions de personnes en Algérie, causant des complexes, des cicatrices et une perte de confiance.',
    solutionText: 'Acnéline utilise la puissance de la nature avec une formule 100% naturelle qui traite l\'acné à la source sans agresser votre peau.',
    benefits: JSON.stringify(['Réduit l\'acné et les boutons en 2 semaines', 'Hydrate et nourrit la peau sans obstruer les pores', 'Diminue les cicatrices et les marques d\'acné']),
    usage: 'Appliquez 3-4 gouttes sur le visage propre et sec, matin et soir.',
    price: 3900, originalPrice: 5500, imageUrl: '/products/acneline.png', category: 'skincare', stock: 150,
  },
  colonclean: {
    id: '2', slug: 'colonclean', name: 'ColonClean',
    tagline: 'Détoxifiez votre système digestif naturellement',
    description: 'ColonClean est un complément naturel puissant conçu pour purifier et détoxifier votre système digestif. Notre formule à base de plantes médicinales aide à éliminer les toxines accumulées.',
    problemText: 'Les problèmes digestifs affectent la vie quotidienne de millions d\'Algériens.',
    solutionText: 'ColonClean offre une détoxification naturelle et en douceur.',
    benefits: JSON.stringify(['Élimine les toxines et purifie le colon', 'Améliore le transit intestinal naturellement', 'Booste l\'énergie et renforce l\'immunité']),
    usage: 'Prenez 2 gélules par jour avec un grand verre d\'eau, de préférence le matin à jeun.',
    price: 3500, originalPrice: 4800, imageUrl: '/products/colonclean.png', category: 'supplement', stock: 200,
  },
  cleanlungs: {
    id: '3', slug: 'cleanlungs', name: 'CleanLungs',
    tagline: 'Respirez librement, vivez pleinement',
    description: 'CleanLungs est un complément naturel avancé spécialement formulé pour nettoyer et protéger vos poumons.',
    problemText: 'La pollution, le tabac et les infections respiratoires fragilisent nos poumons au quotidien.',
    solutionText: 'CleanLungs nettoie et régénère les poumons grâce à une formule 100% naturelle.',
    benefits: JSON.stringify(['Décongestionne les voies respiratoires', 'Élimine les mucosités et toxines pulmonaires', 'Renforce la capacité respiratoire naturellement']),
    usage: 'Prenez 2 gélules par jour avec un verre d\'eau, matin et soir au cours des repas.',
    price: 3700, originalPrice: 5000, imageUrl: '/products/cleanlungs.png', category: 'supplement', stock: 120,
  },
  maca: {
    id: '4', slug: 'maca', name: 'Maca Power',
    tagline: 'L\'énergie naturelle du Pérou pour votre vitalité',
    description: 'Maca Power est un super-aliment puissant issu de la racine de Maca péruvienne, utilisée depuis des millénaires pour ses propriétés énergisantes et équilibrantes.',
    problemText: 'La fatigue chronique, le manque d\'énergie et le déséquilibre hormonal touchent de plus en plus de personnes.',
    solutionText: 'Maca Power puise dans la sagesse ancestrale des Incas avec un extrait pur et concentré de Maca péruvienne.',
    benefits: JSON.stringify(['Booste l\'énergie et l\'endurance physique', 'Équilibre les hormones naturellement', 'Améliore la concentration et la vitalité']),
    usage: 'Prenez 1 à 2 gélules par jour avec un verre d\'eau, de préférence le matin.',
    price: 4200, originalPrice: 5900, imageUrl: '/products/maca.png', category: 'supplement', stock: 180,
  },
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await db.product.findUnique({ where: { slug } });
    if (product) {
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
  } catch (error) {
    console.error('Metadata fetch error:', error);
  }

  const fallback = fallbackProducts[slug];
  if (fallback) {
    return {
      title: `${fallback.name} - ${fallback.tagline} | SCORBIO`,
      description: fallback.description.slice(0, 160),
    };
  }

  return { title: 'Produit non trouvé | SCORBIO' };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  let product = null;
  let relatedProducts: Array<{
    id: string; slug: string; name: string; tagline: string;
    price: number; originalPrice: number | null; imageUrl: string;
  }> = [];

  try {
    product = await db.product.findUnique({ where: { slug } });

    if (product && product.active) {
      const related = await db.product.findMany({
        where: {
          category: product.category,
          active: true,
          id: { not: product.id },
        },
        orderBy: { orderIndex: 'asc' },
        take: 4,
      });

      relatedProducts = related.map((p) => ({
        id: p.id, slug: p.slug, name: p.name, tagline: p.tagline,
        price: p.price, originalPrice: p.originalPrice, imageUrl: p.imageUrl,
      }));
    }
  } catch (error) {
    console.error('Product fetch error, using fallback:', error);
  }

  // Use fallback if DB is unavailable
  if (!product) {
    const fallback = fallbackProducts[slug];
    if (fallback) {
      product = fallback;
      // Get related from fallback data
      relatedProducts = Object.values(fallbackProducts)
        .filter(p => p.category === product!.category && p.slug !== slug)
        .map(p => ({
          id: p.id, slug: p.slug, name: p.name, tagline: p.tagline,
          price: p.price, originalPrice: p.originalPrice, imageUrl: p.imageUrl,
        }));
    }
  }

  if (!product || (product && 'active' in product && !product.active)) {
    notFound();
  }

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

  return <ProductPageClient product={productData} relatedProducts={relatedProducts} />;
}
