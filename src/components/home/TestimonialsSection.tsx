'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { AnimatedSection } from '@/components/shared/AnimatedSection'

interface TestimonialsSectionProps {
  testimonials: Array<{
    name: string
    product: string | null
    rating: number
    text: string
  }>
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const avatarColors = [
  'bg-scorbio-green',
  'bg-scorbio-gold',
  'bg-rose-500',
  'bg-blue-500',
  'bg-amber-500',
  'bg-teal-500',
]

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return
    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }
    handleSelect()
    api.on('select', handleSelect)
    return () => {
      api.off('select', handleSelect)
    }
  }, [api])

  // Auto-play
  useEffect(() => {
    if (!api) return
    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext()
      } else {
        api.scrollTo(0)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [api])

  return (
    <section className="py-16 md:py-24 bg-scorbio-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ce que disent nos clients
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des témoignages authentiques de nos clients satisfaits
          </p>
        </AnimatedSection>

        <AnimatedSection>
          <div className="max-w-5xl mx-auto">
            <Carousel
              setApi={setApi}
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="bg-white rounded-2xl p-6 shadow-soft border border-border h-full flex flex-col">
                      {/* Stars */}
                      <div className="flex gap-0.5 mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`size-4 ${
                              i < testimonial.rating
                                ? 'text-scorbio-gold fill-scorbio-gold'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Text */}
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                        &ldquo;{testimonial.text}&rdquo;
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                            avatarColors[index % avatarColors.length]
                          }`}
                        >
                          {getInitials(testimonial.name)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {testimonial.name}
                          </p>
                          {testimonial.product && (
                            <p className="text-xs text-scorbio-green">
                              {testimonial.product}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12" />
              <CarouselNext className="hidden md:flex -right-12" />
            </Carousel>

            {/* Navigation Dots */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`size-2.5 rounded-full transition-all duration-300 ${
                    current === index
                      ? 'bg-scorbio-green w-6'
                      : 'bg-scorbio-green/30 hover:bg-scorbio-green/50'
                  }`}
                  onClick={() => api?.scrollTo(index)}
                  aria-label={`Aller au témoignage ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
