'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { notFound } from 'next/navigation';
import CheckoutPageClient from './CheckoutPageClient';

// Fallback checkout product data
const fallbackCheckoutProducts: Record<string, {
  id: string; slug: string; name: string; tagline: string;
  price: number; originalPrice: number | null; imageUrl: string; stock: number;
}> = {
  acneline: { id: '1', slug: 'acneline', name: 'Acnéline', tagline: 'Votre solution naturelle contre l\'acné', price: 3900, originalPrice: 5500, imageUrl: '/products/acneline.png', stock: 150 },
  colonclean: { id: '2', slug: 'colonclean', name: 'ColonClean', tagline: 'Détoxifiez votre système digestif naturellement', price: 3500, originalPrice: 4800, imageUrl: '/products/colonclean.png', stock: 200 },
  cleanlungs: { id: '3', slug: 'cleanlungs', name: 'CleanLungs', tagline: 'Respirez librement, vivez pleinement', price: 3700, originalPrice: 5000, imageUrl: '/products/cleanlungs.png', stock: 120 },
  maca: { id: '4', slug: 'maca', name: 'Maca Power', tagline: 'L\'énergie naturelle du Pérou pour votre vitalité', price: 4200, originalPrice: 5900, imageUrl: '/products/maca.png', stock: 180 },
};

export default function CheckoutPageWrapper({
  slugPromise,
  refPromise,
}: {
  slugPromise: Promise<{ slug: string }>;
  refPromise: Promise<{ ref?: string }>;
}) {
  const { slug } = use(slugPromise);
  const { ref } = use(refPromise);
  const [product, setProduct] = useState(fallbackCheckoutProducts[slug] || null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.product) {
            setProduct(data.product);
          }
        }
      } catch (error) {
        console.error('Checkout product fetch error, using fallback:', error);
      }
    }
    fetchProduct();
  }, [slug]);

  if (!product) {
    notFound();
  }

  return <CheckoutPageClient product={product} affiliateCode={ref || null} />;
}
