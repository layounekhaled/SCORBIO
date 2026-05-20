'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, Leaf, Truck, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const badges = [
  { text: '100% Naturel', icon: Leaf },
  { text: 'Livraison 58 Wilayas', icon: Truck },
  { text: 'Paiement à la livraison', icon: ShieldCheck },
]

const trustIndicators = [
  { icon: Truck, text: 'Livraison rapide' },
  { icon: ShieldCheck, text: 'Paiement à la livraison' },
  { icon: Leaf, text: 'Produits certifiés' },
]

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Urgency Banner */}
      <div className="bg-gradient-green text-white text-center py-2.5 px-4 text-sm font-medium">
        🔥 Offre limitée - Jusqu&apos;à -30% sur tous les produits
      </div>

      {/* Main Hero Content */}
      <div className="flex-1 relative bg-gradient-to-b from-white via-white to-scorbio-green-pale/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-0 min-h-[calc(100vh-44px)] flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">
            {/* Left Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="z-10"
            >
              <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-6">
                {badges.map((badge) => (
                  <Badge
                    key={badge.text}
                    variant="secondary"
                    className="bg-scorbio-green-pale text-scorbio-green border-scorbio-green/20 px-3 py-1 text-xs font-medium"
                  >
                    <badge.icon className="size-3 mr-1" />
                    {badge.text}
                  </Badge>
                ))}
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
              >
                La puissance du{' '}
                <span className="text-scorbio-green">naturel</span>
                {' '}pour votre corps
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl"
              >
                Des solutions 100% naturelles pour votre santé et votre beauté
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <Button
                  size="lg"
                  className="bg-gradient-green hover:opacity-90 text-white px-8 py-6 text-base shadow-premium"
                  onClick={() => {
                    document.getElementById('produits')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Découvrir les produits
                  <ArrowDown className="size-4 ml-1" />
                </Button>
                <Link href="/affilie">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-scorbio-green text-scorbio-green hover:bg-scorbio-green-pale px-8 py-6 text-base w-full sm:w-auto"
                  >
                    Devenir affilié
                  </Button>
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-6"
              >
                {trustIndicators.map((indicator) => (
                  <div
                    key={indicator.text}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <div className="size-8 rounded-full bg-scorbio-green-pale flex items-center justify-center">
                      <indicator.icon className="size-4 text-scorbio-green" />
                    </div>
                    <span>{indicator.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-scorbio-green/5 to-scorbio-gold/5 rounded-full blur-3xl" />
              <div className="relative w-full max-w-md lg:max-w-lg aspect-square">
                <Image
                  src="/hero-bg.png"
                  alt="SCORBIO - Produits naturels pour la santé et la beauté"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
