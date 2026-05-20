import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const promoSchema = z.object({
  code: z.string().min(1, 'Code promo requis'),
  amount: z.number().min(0, 'Montant requis'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = promoSchema.parse(body);

    const promo = await db.promoCode.findUnique({
      where: { code: data.code.toUpperCase() },
    });

    if (!promo) {
      return NextResponse.json({
        valid: false,
        message: 'Code promo introuvable',
      });
    }

    if (!promo.active) {
      return NextResponse.json({
        valid: false,
        message: 'Ce code promo n\'est plus actif',
      });
    }

    const now = new Date();
    if (promo.expiresAt && promo.expiresAt < now) {
      return NextResponse.json({
        valid: false,
        message: 'Ce code promo a expiré',
      });
    }

    if (promo.maxUses !== null && promo.currentUses >= promo.maxUses) {
      return NextResponse.json({
        valid: false,
        message: 'Ce code promo a atteint sa limite d\'utilisation',
      });
    }

    if (data.amount < promo.minOrder) {
      return NextResponse.json({
        valid: false,
        message: `Montant minimum requis : ${new Intl.NumberFormat('fr-DZ').format(promo.minOrder)} DA`,
      });
    }

    let discountAmount = 0;
    if (promo.discountType === 'percentage') {
      discountAmount = Math.round((data.amount * promo.discountValue) / 100);
    } else {
      discountAmount = promo.discountValue;
    }

    const message =
      promo.discountType === 'percentage'
        ? `-${promo.discountValue}% appliqué ! Vous économisez ${new Intl.NumberFormat('fr-DZ').format(discountAmount)} DA`
        : `-${new Intl.NumberFormat('fr-DZ').format(discountAmount)} DA appliqué !`;

    return NextResponse.json({
      valid: true,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      discountAmount,
      message,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { valid: false, message: 'Données invalides' },
        { status: 400 }
      );
    }
    console.error('Promo validation error:', error);
    return NextResponse.json(
      { valid: false, message: 'Erreur de validation' },
      { status: 500 }
    );
  }
}
