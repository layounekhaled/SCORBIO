import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const testimonials = await db.testimonial.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      select: {
        name: true,
        product: true,
        rating: true,
        text: true,
      },
    });

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error('Testimonials fetch error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des témoignages' },
      { status: 500 }
    );
  }
}
