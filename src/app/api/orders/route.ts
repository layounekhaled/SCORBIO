import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { getWilayaName } from '@/lib/wilayas';

const orderSchema = z.object({
  nomClient: z.string().min(2, 'Le nom est requis'),
  telephone: z.string().min(10, 'Téléphone invalide'),
  adresse: z.string().min(5, "L'adresse est requise"),
  commune: z.string().min(2, 'La commune est requise'),
  codeWilaya: z.string().min(1, 'Wilaya requise'),
  items: z.array(
    z.object({
      productId: z.string(),
      quantite: z.number().int().min(1),
    })
  ).min(1, 'Au moins un produit est requis'),
  affiliateCode: z.string().optional(),
  promoCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = orderSchema.parse(body);

    // Verify products exist and calculate total
    const productIds = data.items.map((item) => item.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds }, active: true },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'Un ou plusieurs produits sont introuvables' },
        { status: 400 }
      );
    }

    let montant = 0;
    const orderItemsData: Array<{
      productId: string;
      produit: string;
      quantite: number;
      prix: number;
    }> = [];

    for (const item of data.items) {
      const product = products.find((p) => p.id === item.productId)!;
      if (product.stock < item.quantite) {
        return NextResponse.json(
          { error: `Stock insuffisant pour ${product.name}` },
          { status: 400 }
        );
      }
      const itemTotal = product.price * item.quantite;
      montant += itemTotal;
      orderItemsData.push({
        productId: product.id,
        produit: product.name,
        quantite: item.quantite,
        prix: product.price,
      });
    }

    // Handle promo code
    let discount = 0;
    if (data.promoCode) {
      const promo = await db.promoCode.findUnique({
        where: { code: data.promoCode },
      });
      if (promo && promo.active) {
        const now = new Date();
        const expired = promo.expiresAt && promo.expiresAt < now;
        const maxUsesReached = promo.maxUses !== null && promo.currentUses >= promo.maxUses;
        const minOrderMet = montant >= promo.minOrder;

        if (!expired && !maxUsesReached && minOrderMet) {
          if (promo.discountType === 'percentage') {
            discount = Math.round((montant * promo.discountValue) / 100);
          } else {
            discount = promo.discountValue;
          }
          // Increment uses
          await db.promoCode.update({
            where: { code: data.promoCode },
            data: { currentUses: { increment: 1 } },
          });
        }
      }
    }

    const finalAmount = Math.max(0, montant - discount);
    const wilayaName = getWilayaName(data.codeWilaya);

    // Generate order number
    const orderCount = await db.order.count();
    const orderNumber = `SCB-${String(orderCount + 1).padStart(5, '0')}`;

    // Create order
    const order = await db.order.create({
      data: {
        nomClient: data.nomClient,
        telephone: data.telephone,
        adresse: data.adresse,
        commune: data.commune,
        codeWilaya: data.codeWilaya,
        wilayaName,
        montant: finalAmount,
        status: 'en_preparation_stock',
        affiliateCode: data.affiliateCode || null,
        promoCode: data.promoCode || null,
        discount,
        items: {
          create: orderItemsData,
        },
      },
    });

    // Update stock
    for (const item of data.items) {
      await db.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantite } },
      });
    }

    // Update affiliate stats
    if (data.affiliateCode) {
      const affiliate = await db.affiliate.findUnique({
        where: { code: data.affiliateCode },
      });
      if (affiliate) {
        const commission = Math.round((finalAmount * affiliate.commissionRate) / 100);
        await db.affiliate.update({
          where: { code: data.affiliateCode },
          data: {
            totalSales: { increment: finalAmount },
            totalCommissions: { increment: commission },
          },
        });
      }
    }

    // Ecotrack API integration (placeholder)
    // try {
    //   const ecotrackResponse = await fetch('https://ecotrack.dz/api/create/order', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       nom_client: data.nomClient,
    //       telephone: data.telephone,
    //       adresse: data.adresse,
    //       commune: data.commune,
    //       code_wilaya: data.codeWilaya,
    //       montant: finalAmount,
    //       produit: orderItemsData.map(i => i.produit).join(', '),
    //       quantite: orderItemsData.reduce((s, i) => s + i.quantite, 0),
    //     }),
    //   });
    //   const ecotrackData = await ecotrackResponse.json();
    //   await db.order.update({
    //     where: { id: order.id },
    //     data: { ecotrackId: ecotrackData.id },
    //   });
    // } catch (ecotrackError) {
    //   console.error('Ecotrack API error:', ecotrackError);
    // }

    return NextResponse.json(
      {
        orderId: order.id,
        orderNumber,
        status: order.status,
        montant: finalAmount,
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
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    );
  }
}
