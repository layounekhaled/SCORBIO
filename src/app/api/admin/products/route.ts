import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET: All products
export async function GET() {
  try {
    const products = await db.product.findMany({
      orderBy: { orderIndex: 'asc' },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Admin products fetch error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    );
  }
}

// PUT: Update product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, price, originalPrice, stock, active, name, tagline } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'ID produit requis' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (price !== undefined) updateData.price = price;
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice;
    if (stock !== undefined) updateData.stock = stock;
    if (active !== undefined) updateData.active = active;
    if (name !== undefined) updateData.name = name;
    if (tagline !== undefined) updateData.tagline = tagline;

    const product = await db.product.update({
      where: { id: productId },
      data: updateData,
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du produit' },
      { status: 500 }
    );
  }
}
