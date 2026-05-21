'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { notFound } from 'next/navigation';
import ProductPageClient from './ProductPageClient';

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
};

export default function ProductPageWrapper({ slugPromise }: { slugPromise: Promise<{ slug: string }> }) {
  const { slug } = use(slugPromise);
  const [product, setProduct] = useState(fallbackProducts[slug] || null);
  const [relatedProducts, setRelatedProducts] = useState<Array<{
    id: string; slug: string; name: string; tagline: string;
    price: number; originalPrice: number | null; imageUrl: string;
  }>>([]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.product) {
            setProduct(data.product);
            if (data.relatedProducts) {
              setRelatedProducts(data.relatedProducts);
            }
          }
        }
      } catch (error) {
        console.error('Product fetch error, using fallback:', error);
      }
    }
    fetchProduct();
  }, [slug]);

  if (!product) {
    notFound();
  }

  return <ProductPageClient product={product} relatedProducts={relatedProducts} />;
}
