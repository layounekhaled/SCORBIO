'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Check,
  Minus,
  Plus,
  ShoppingCart,
  MessageCircle,
  Leaf,
  Truck,
  Banknote,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useCartStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

interface ProductPageClientProps {
  product: {
    id: string;
    slug: string;
    name: string;
    tagline: string;
    description: string;
    problemText: string;
    solutionText: string;
    benefits: string;
    usage: string;
    price: number;
    originalPrice: number | null;
    imageUrl: string;
    category: string;
    stock: number;
  };
  relatedProducts: Array<{
    id: string;
    slug: string;
    name: string;
    tagline: string;
    price: number;
    originalPrice: number | null;
    imageUrl: string;
  }>;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function ProductPageClient({
  product,
  relatedProducts,
}: ProductPageClientProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  const benefits: string[] = JSON.parse(product.benefits || '[]');
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-DZ').format(price) + ' DA';

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice ?? undefined,
      imageUrl: product.imageUrl,
    });
    router.push(`/commander/${product.slug}`);
  };

  const whatsappMessage = encodeURIComponent(
    `Bonjour ! Je souhaite commander ${quantity}x ${product.name} (${formatPrice(product.price * quantity)}). Merci !`
  );
  const whatsappUrl = `https://wa.me/213550000000?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-scorbio-green-pale to-white shadow-premium">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain p-6"
                  priority
                />
                {discount > 0 && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 text-white text-sm px-3 py-1">
                      -{discount}%
                    </Badge>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col gap-5"
            >
              <div>
                <p className="text-scorbio-green font-semibold text-sm uppercase tracking-wider mb-2">
                  {product.category === 'skincare' ? 'Soins de la peau' : 'Complément alimentaire'}
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {product.name}
                </h1>
                <p className="text-lg text-muted-foreground">{product.tagline}</p>
              </div>

              {/* Price */}
              <div className="flex items-end gap-3">
                <span className="text-3xl md:text-4xl font-bold text-scorbio-green">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {discount > 0 && (
                <p className="text-red-500 font-medium">
                  Économisez {formatPrice(product.originalPrice! - product.price)} !
                </p>
              )}

              {/* Stock urgency */}
              {product.stock <= 20 && product.stock > 0 && (
                <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-4 py-2 rounded-lg">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">
                    Plus que {product.stock} en stock - Commandez vite !
                  </span>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Quantité :</span>
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 rounded-l-lg"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="h-10 w-10 rounded-r-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3 mt-2">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  className="h-14 text-lg font-semibold bg-gradient-green hover:opacity-90 text-white rounded-xl shadow-lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Commander maintenant
                </Button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-14 text-lg font-semibold bg-[#25D366] hover:bg-[#1da851] text-white rounded-xl shadow-lg transition-colors gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Commander via WhatsApp
                </a>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="flex flex-col items-center text-center gap-1.5 p-3 bg-scorbio-green-pale rounded-xl">
                  <Leaf className="w-5 h-5 text-scorbio-green" />
                  <span className="text-xs font-medium text-scorbio-green">100% Naturel</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5 p-3 bg-scorbio-green-pale rounded-xl">
                  <Truck className="w-5 h-5 text-scorbio-green" />
                  <span className="text-xs font-medium text-scorbio-green">Livraison 58 Wilayas</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5 p-3 bg-scorbio-green-pale rounded-xl">
                  <Banknote className="w-5 h-5 text-scorbio-green" />
                  <span className="text-xs font-medium text-scorbio-green">Paiement à la livraison</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={staggerContainer}
        className="py-12 md:py-20 bg-red-50/50"
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div variants={fadeInUp} className="text-center mb-8">
            <Badge variant="outline" className="mb-4 border-red-300 text-red-600 bg-red-50">
              Le Problème
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Vous vous reconnaissez ?
            </h2>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Card className="p-6 md:p-8 border-red-100 bg-white shadow-soft">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.problemText}
              </p>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Solution Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={staggerContainer}
        className="py-12 md:py-20 bg-scorbio-green-pale/30"
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div variants={fadeInUp} className="text-center mb-8">
            <Badge className="mb-4 bg-scorbio-green text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              La Solution
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {product.name}, votre allié naturel
            </h2>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Card className="p-6 md:p-8 border-scorbio-green/20 bg-white shadow-soft">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.solutionText}
              </p>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={staggerContainer}
        className="py-12 md:py-20"
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div variants={fadeInUp} className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Pourquoi choisir {product.name} ?
            </h2>
          </motion.div>
          <motion.div variants={staggerContainer} className="grid gap-4">
            {benefits.map((benefit, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="p-5 flex items-start gap-4 border-scorbio-green/10 bg-white hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-scorbio-green flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-base md:text-lg text-foreground font-medium">{benefit}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Usage Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={staggerContainer}
        className="py-12 md:py-20 bg-muted/30"
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div variants={fadeInUp} className="text-center mb-8">
            <ShieldCheck className="w-10 h-10 text-scorbio-green mx-auto mb-3" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Mode d&apos;emploi
            </h2>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Card className="p-6 md:p-8 border-border bg-white shadow-soft">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.usage}
              </p>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="py-12 md:py-20"
        >
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div variants={fadeInUp} className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Vous aimerez aussi
              </h2>
              <p className="text-muted-foreground">D'autres produits qui pourraient vous intéresser</p>
            </motion.div>
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {relatedProducts.map((rp) => (
                <motion.div key={rp.id} variants={fadeInUp}>
                  <Link href={`/produit/${rp.slug}`}>
                    <Card className="group overflow-hidden border-border hover:shadow-premium transition-all duration-300 bg-white">
                      <div className="relative aspect-square bg-scorbio-green-pale/50 p-4">
                        <Image
                          src={rp.imageUrl}
                          alt={rp.name}
                          fill
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground mb-1">{rp.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{rp.tagline}</p>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-scorbio-green">
                            {formatPrice(rp.price)}
                          </span>
                          {rp.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(rp.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Final CTA */}
      <section className="py-12 md:py-20 bg-gradient-green text-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Prêt à transformer votre quotidien ?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Commandez {product.name} maintenant et profitez de la livraison à domicile partout en Algérie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleAddToCart}
              className="h-14 text-lg font-semibold bg-white text-scorbio-green hover:bg-white/90 rounded-xl shadow-lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Commander maintenant - {formatPrice(product.price)}
            </Button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-14 text-lg font-semibold bg-[#25D366] hover:bg-[#1da851] text-white rounded-xl shadow-lg transition-colors gap-2 px-8"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
