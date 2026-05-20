import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const affiliateSchema = z.object({
  name: z.string().min(2, 'Le nom est requis'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  phone: z.string().min(10, 'Téléphone invalide').optional().or(z.literal('')),
});

// POST: Register new affiliate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = affiliateSchema.parse(body);

    // Generate unique affiliate code
    const namePart = data.name
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .slice(0, 10);
    const code = `SCORBIO_${namePart}`;

    // Check if code already exists
    const existing = await db.affiliate.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json(
        { error: 'Un affilié avec ce nom existe déjà' },
        { status: 409 }
      );
    }

    const affiliate = await db.affiliate.create({
      data: {
        code,
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        commissionRate: 20,
      },
    });

    const referralLink = `${request.headers.get('origin') || 'https://scorbio.dz'}/?ref=${code}`;

    return NextResponse.json(
      {
        affiliate: {
          id: affiliate.id,
          code: affiliate.code,
          name: affiliate.name,
          commissionRate: affiliate.commissionRate,
        },
        referralLink,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Affiliate creation error:', error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'affilié" },
      { status: 500 }
    );
  }
}

// GET: Get affiliate stats
export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Code affilié requis' },
        { status: 400 }
      );
    }

    const affiliate = await db.affiliate.findUnique({
      where: { code },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            items: true,
          },
        },
      },
    });

    if (!affiliate) {
      return NextResponse.json(
        { error: 'Affilié introuvable' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      affiliate: {
        id: affiliate.id,
        code: affiliate.code,
        name: affiliate.name,
        commissionRate: affiliate.commissionRate,
        totalSales: affiliate.totalSales,
        totalCommissions: affiliate.totalCommissions,
        recentOrders: affiliate.orders.map((o) => ({
          id: o.id,
          nomClient: o.nomClient,
          montant: o.montant,
          status: o.status,
          createdAt: o.createdAt,
          items: o.items.map((i) => ({
            produit: i.produit,
            quantite: i.quantite,
            prix: i.prix,
          })),
        })),
      },
    });
  } catch (error) {
    console.error('Affiliate stats error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
