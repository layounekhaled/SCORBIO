'use client'

import { Frown, BatteryLow, Pill, ZapOff } from 'lucide-react'
import { AnimatedSection } from '@/components/shared/AnimatedSection'

const problems = [
  {
    icon: Frown,
    title: 'Acné & boutons',
    description:
      'L\'acné persistante qui laisse des cicatrices et affecte votre confiance en vous au quotidien.',
  },
  {
    icon: BatteryLow,
    title: 'Fatigue chronique',
    description:
      'Un épuisement constant qui vous empêche de profiter pleinement de votre journée.',
  },
  {
    icon: Pill,
    title: 'Problèmes digestifs',
    description:
      'Ballonnements, constipation et inconfort qui gâchent votre qualité de vie.',
  },
  {
    icon: ZapOff,
    title: "Manque d'énergie",
    description:
      'Une baisse de vitalité et de motivation qui impacte votre bien-être général.',
  },
]

export default function ProblemsSection() {
  return (
    <section className="bg-scorbio-cream py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Vous souffrez de ces problèmes ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des maux quotidiens qui affectent votre qualité de vie
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <AnimatedSection key={problem.title} delay={index * 0.1}>
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-red-100/50 hover:shadow-card transition-shadow duration-300 h-full">
                <div className="size-14 rounded-xl bg-red-50 flex items-center justify-center mb-5">
                  <problem.icon className="size-7 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {problem.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
