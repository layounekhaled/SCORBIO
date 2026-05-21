import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get('slug');

    if (slug) {
      // Fetch single product with related products
      const product = await db.product.findUnique({ where: { slug } });

      if (!product) {
        return NextResponse.json(
          { error: 'Produit introuvable' },
          { status: 404 }
        );
      }

      const relatedProducts = await db.product.findMany({
        where: {
          category: product.category,
          active: true,
          id: { not: product.id },
        },
        orderBy: { orderIndex: 'asc' },
        take: 4,
        select: {
          id: true,
          slug: true,
          name: true,
          tagline: true,
          price: true,
          originalPrice: true,
          imageUrl: true,
        },
      });

      return NextResponse.json({ product, relatedProducts });
    }

    // Fetch all active products
    const products = await db.product.findMany({
      where: { active: true },
      orderBy: { orderIndex: 'asc' },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    );
  }
}
