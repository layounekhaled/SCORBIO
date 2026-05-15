'use client'

import { Truck, Banknote, PackageCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedSection } from '@/components/shared/AnimatedSection'

const features = [
  {
    icon: Truck,
    title: 'Livraison rapide',
    description: 'Expédition sous 24-48h dans les 58 wilayas',
  },
  {
    icon: Banknote,
    title: 'Paiement à la livraison',
    description: 'Payez cash à la réception de votre commande',
  },
  {
    icon: PackageCheck,
    title: 'Suivi de commande',
    description: 'Suivez votre commande en temps réel',
  },
]

export default function DeliverySection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Livraison partout en Algérie
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un service de livraison fiable et pratique pour toutes les wilayas
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {features.map((feature, index) => (
            <AnimatedSection key={feature.title} delay={index * 0.12}>
              <div className="text-center p-8 rounded-2xl bg-scorbio-cream/50 border border-scorbio-green/10 hover:shadow-soft transition-shadow duration-300">
                <div className="size-16 rounded-2xl bg-scorbio-green-pale flex items-center justify-center mx-auto mb-5">
                  <feature.icon className="size-8 text-scorbio-green" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3} className="text-center">
          <Button
            size="lg"
            className="bg-gradient-green hover:opacity-90 text-white px-10 py-6 text-base shadow-premium"
            onClick={() => {
              document.getElementById('produits')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Commander maintenant
          </Button>
        </AnimatedSection>
      </div>
    </section>
  )
}
