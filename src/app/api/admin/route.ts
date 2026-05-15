import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [totalRevenue, totalOrders, totalAffiliates, totalProducts] = await Promise.all([
      db.order.aggregate({ _sum: { montant: true } }),
      db.order.count(),
      db.affiliate.count(),
      db.product.count({ where: { active: true } }),
    ]);

    // Recent orders for chart data
    const recentOrders = await db.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
      select: {
        id: true,
        montant: true,
        status: true,
        createdAt: true,
      },
    });

    // Orders by status
    const ordersByStatus = await db.order.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    // Top products
    const topProducts = await db.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantite: true },
      _count: true,
      orderBy: { _sum: { quantite: 'desc' } },
      take: 5,
    });

    const productIds = topProducts.map((tp) => tp.productId);
    const productsData = await db.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, imageUrl: true },
    });

    const topProductsWithInfo = topProducts.map((tp) => {
      const product = productsData.find((p) => p.id === tp.productId);
      return {
        productId: tp.productId,
        name: product?.name || 'Inconnu',
        imageUrl: product?.imageUrl || '',
        totalQuantity: tp._sum.quantite || 0,
        orderCount: tp._count,
      };
    });

    return NextResponse.json({
      stats: {
        totalRevenue: totalRevenue._sum.montant || 0,
        totalOrders,
        totalAffiliates,
        totalProducts,
      },
      recentOrders,
      ordersByStatus: ordersByStatus.map((obs) => ({
        status: obs.status,
        count: obs._count.status,
      })),
      topProducts: topProductsWithInfo,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
