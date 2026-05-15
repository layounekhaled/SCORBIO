'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Check, ShoppingCart, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AnimatedSection } from '@/components/shared/AnimatedSection'

interface ProductsSectionProps {
  products: Array<{
    id: string
    slug: string
    name: string
    tagline: string
    benefits: string
    price: number
    originalPrice: number | null
    imageUrl: string
    stock: number
  }>
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-DZ').format(price) + ' DA'
}

function getDiscountPercent(price: number, originalPrice: number): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

export default function ProductsSection({ products }: ProductsSectionProps) {
  return (
    <section id="produits" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Nos Produits
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des solutions naturelles pour chaque besoin
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => {
            const benefits: string[] = JSON.parse(product.benefits || '[]')
            const discount = product.originalPrice
              ? getDiscountPercent(product.price, product.originalPrice)
              : 0

            return (
              <AnimatedSection key={product.id} delay={index * 0.1}>
                <div className="bg-white rounded-2xl border border-border shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-scorbio-cream p-4">
                    {discount > 0 && (
                      <Badge className="absolute top-3 right-3 bg-red-500 text-white border-0 text-xs font-bold">
                        -{discount}%
                      </Badge>
                    )}
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {product.tagline}
                    </p>

                    {/* Benefits */}
                    <ul className="space-y-1.5 mb-5 flex-1">
                      {benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-2 text-sm">
                          <Check className="size-4 text-scorbio-green shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-xl font-bold text-scorbio-green">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Stock */}
                    {product.stock <= 20 && (
                      <div className="flex items-center gap-1.5 text-xs text-orange-600 mb-3">
                        <AlertTriangle className="size-3.5" />
                        <span>Plus que {product.stock} en stock</span>
                      </div>
                    )}

                    {/* CTA Buttons */}
                    <div className="flex flex-col gap-2">
                      <Link href={`/commander/${product.slug}`}>
                        <Button className="w-full bg-gradient-green hover:opacity-90 text-white shadow-soft">
                          <ShoppingCart className="size-4 mr-2" />
                          Commander maintenant
                        </Button>
                      </Link>
                      <Link
                        href={`/produit/${product.slug}`}
                        className="text-center text-sm text-scorbio-green hover:underline font-medium"
                      >
                        Voir détails
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </section>
  )
}
