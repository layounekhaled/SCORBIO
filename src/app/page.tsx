import { db } from '@/lib/db'
import HeroSection from '@/components/home/HeroSection'
import ProblemsSection from '@/components/home/ProblemsSection'
import SolutionSection from '@/components/home/SolutionSection'
import ProductsSection from '@/components/home/ProductsSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import DeliverySection from '@/components/home/DeliverySection'

export default async function Home() {
  const [products, testimonials] = await Promise.all([
    db.product.findMany({
      where: { active: true },
      orderBy: { orderIndex: 'asc' },
      select: {
        id: true,
        slug: true,
        name: true,
        tagline: true,
        benefits: true,
        price: true,
        originalPrice: true,
        imageUrl: true,
        stock: true,
      },
    }),
    db.testimonial.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      select: {
        name: true,
        product: true,
        rating: true,
        text: true,
      },
    }),
  ])

  return (
    <main className="min-h-screen flex flex-col">
      <HeroSection />
      <ProblemsSection />
      <SolutionSection />
      <ProductsSection products={products} />
      <TestimonialsSection testimonials={testimonials} />
      <DeliverySection />
    </main>
  )
}
