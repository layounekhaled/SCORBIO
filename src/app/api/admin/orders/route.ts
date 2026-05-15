import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET: All orders with items
export async function GET() {
  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        affiliate: {
          select: { code: true, name: true },
        },
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Admin orders fetch error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    );
  }
}

// PUT: Update order status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'ID commande et statut requis' },
        { status: 400 }
      );
    }

    const validStatuses = [
      'en_preparation_stock',
      'expediee',
      'en_livraison',
      'livree',
      'annulee',
      'retournee',
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      );
    }

    const order = await db.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}
