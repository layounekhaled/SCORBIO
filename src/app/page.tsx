'use client'

import { useEffect, useState } from 'react'
import HeroSection from '@/components/home/HeroSection'
import ProblemsSection from '@/components/home/ProblemsSection'
import SolutionSection from '@/components/home/SolutionSection'
import ProductsSection from '@/components/home/ProductsSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import DeliverySection from '@/components/home/DeliverySection'

// Fallback data when API is unavailable
const fallbackProducts = [
  {
    id: '1', slug: 'acneline', name: 'Acnéline',
    tagline: 'Votre solution naturelle contre l\'acné',
    benefits: JSON.stringify(['Réduit l\'acné et les boutons en 2 semaines', 'Hydrate et nourrit la peau sans obstruer les pores', 'Diminue les cicatrices et les marques d\'acné']),
    price: 3900, originalPrice: 5500, imageUrl: '/products/acneline.png', stock: 150,
  },
  {
    id: '2', slug: 'colonclean', name: 'ColonClean',
    tagline: 'Détoxifiez votre système digestif naturellement',
    benefits: JSON.stringify(['Élimine les toxines et purifie le colon', 'Améliore le transit intestinal naturellement', 'Booste l\'énergie et renforce l\'immunité']),
    price: 3500, originalPrice: 4800, imageUrl: '/products/colonclean.png', stock: 200,
  },
  {
    id: '3', slug: 'cleanlungs', name: 'CleanLungs',
    tagline: 'Respirez librement, vivez pleinement',
    benefits: JSON.stringify(['Décongestionne les voies respiratoires', 'Élimine les mucosités et toxines pulmonaires', 'Renforce la capacité respiratoire naturellement']),
    price: 3700, originalPrice: 5000, imageUrl: '/products/cleanlungs.png', stock: 120,
  },
  {
    id: '4', slug: 'maca', name: 'Maca Power',
    tagline: 'L\'énergie naturelle du Pérou pour votre vitalité',
    benefits: JSON.stringify(['Booste l\'énergie et l\'endurance physique', 'Équilibre les hormones naturellement', 'Améliore la concentration et la vitalité']),
    price: 4200, originalPrice: 5900, imageUrl: '/products/maca.png', stock: 180,
  },
]

const fallbackTestimonials = [
  { name: 'Amina B.', product: 'Acnéline', rating: 5, text: 'Après 3 semaines d\'utilisation, mon acné a considérablement diminué. Ma peau est plus nette et plus douce. Je recommande à 100% !' },
  { name: 'Karim M.', product: 'ColonClean', rating: 5, text: 'Mon transit est redevenu régulier après seulement 10 jours. Je me sens beaucoup plus léger et énergique. Produit miracle !' },
  { name: 'Fatima Z.', product: 'CleanLungs', rating: 5, text: 'En tant qu\'ancienne fumeuse, je cherchais un produit naturel pour nettoyer mes poumons. CleanLungs m\'a aidée à respirer beaucoup mieux.' },
  { name: 'Youcef A.', product: 'Maca Power', rating: 5, text: 'Énergie incroyable ! Je me sens beaucoup plus dynamique au quotidien. Ma concentration au travail s\'est aussi améliorée.' },
  { name: 'Sara L.', product: 'Acnéline', rating: 4, text: 'Très bon produit, ma peau s\'est nettement améliorée. Le seul bémol c\'est le temps qu\'il faut pour voir les résultats, mais ça vaut le coup.' },
  { name: 'Mourad D.', product: 'ColonClean', rating: 5, text: 'Souffrait de ballonnements depuis des années. Après une cure de ColonClean, c\'est comme si j\'avais un nouveau système digestif. Merci SCORBIO !' },
]

export default function Home() {
  const [products, setProducts] = useState(fallbackProducts)
  const [testimonials, setTestimonials] = useState(fallbackTestimonials)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/products')
        if (res.ok) {
          const data = await res.json()
          if (data.products && data.products.length > 0) {
            setProducts(data.products)
          }
        }
      } catch (error) {
        console.error('Products fetch error, using fallback:', error)
      }

      try {
        const res = await fetch('/api/testimonials')
        if (res.ok) {
          const data = await res.json()
          if (data.testimonials && data.testimonials.length > 0) {
            setTestimonials(data.testimonials)
          }
        }
      } catch (error) {
        console.error('Testimonials fetch error, using fallback:', error)
      }
    }
    fetchData()
  }, [])

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
