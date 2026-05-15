import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const affiliates = await db.affiliate.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        code: true,
        name: true,
        email: true,
        phone: true,
        commissionRate: true,
        totalSales: true,
        totalCommissions: true,
        active: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ affiliates });
  } catch (error) {
    console.error('Admin affiliates fetch error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des affiliés' },
      { status: 500 }
    );
  }
}
