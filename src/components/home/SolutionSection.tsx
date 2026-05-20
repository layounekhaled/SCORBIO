'use client'

import { Leaf, ShieldCheck, Award, CheckCircle2 } from 'lucide-react'
import { AnimatedSection } from '@/components/shared/AnimatedSection'

const differentiators = [
  {
    icon: Leaf,
    title: '100% Naturel',
    description: 'Formules à base d\'ingrédients naturels soigneusement sélectionnés',
  },
  {
    icon: ShieldCheck,
    title: 'Sans chimique',
    description: 'Aucun produit chimique nocif pour votre corps',
  },
  {
    icon: Award,
    title: 'Efficace & sûr',
    description: 'Résultats prouvés sans effets secondaires',
  },
]

const stats = [
  { value: '1000+', label: 'Clients satisfaits' },
  { value: '4', label: 'Produits naturels' },
  { value: '58', label: 'Wilayas livrées' },
]

export default function SolutionSection() {
  return (
    <section className="bg-gradient-green py-16 md:py-24 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            La solution naturelle de SCORBIO
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Des produits formulés avec soin pour votre bien-être
          </p>
        </AnimatedSection>

        {/* Differentiators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {differentiators.map((diff, index) => (
            <AnimatedSection key={diff.title} delay={index * 0.15}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10 hover:bg-white/15 transition-colors duration-300">
                <div className="size-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-6">
                  <diff.icon className="size-8 text-white" />
                </div>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <h3 className="text-xl font-semibold text-white">{diff.title}</h3>
                  <CheckCircle2 className="size-5 text-scorbio-gold" />
                </div>
                <p className="text-white/75 text-sm leading-relaxed">{diff.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Stats */}
        <AnimatedSection delay={0.3}>
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-scorbio-gold mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
