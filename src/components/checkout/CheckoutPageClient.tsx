'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Minus,
  Plus,
  Tag,
  MessageCircle,
  Banknote,
  CheckCircle2,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { wilayas } from '@/lib/wilayas';
import { useCartStore } from '@/lib/store';

const checkoutSchema = z.object({
  nomClient: z.string().min(2, 'Le nom est requis'),
  telephone: z
    .string()
    .regex(/^(0[5-7]\d{8})$/, 'Numéro algérien invalide (ex: 0550123456)'),
  codeWilaya: z.string().min(1, 'Veuillez sélectionner une wilaya'),
  commune: z.string().min(2, 'La commune est requise'),
  adresse: z.string().min(5, "L'adresse est requise"),
  promoCode: z.string().optional(),
  affiliateCode: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutPageClientProps {
  product: {
    id: string;
    slug: string;
    name: string;
    tagline: string;
    price: number;
    originalPrice: number | null;
    imageUrl: string;
    stock: number;
  };
  affiliateCode: string | null;
}

export default function CheckoutPageClient({
  product,
  affiliateCode: initialAffiliateCode,
}: CheckoutPageClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [promoValidating, setPromoValidating] = useState(false);
  const [promoResult, setPromoResult] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderId: string;
    orderNumber: string;
  } | null>(null);

  const addItem = useCartStore((s) => s.addItem);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      affiliateCode: initialAffiliateCode || '',
    },
  });

  useEffect(() => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice ?? undefined,
      imageUrl: product.imageUrl,
    });
  }, [product, addItem]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-DZ').format(price) + ' DA';

  const subtotal = product.price * quantity;
  const total = Math.max(0, subtotal - discount);

  const validatePromo = async () => {
    if (!promoCode.trim()) return;
    setPromoValidating(true);
    setPromoResult(null);
    try {
      const res = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode, amount: subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setDiscount(data.discountAmount);
        setPromoResult({ valid: true, message: data.message || 'Code promo appliqué !' });
      } else {
        setDiscount(0);
        setPromoResult({ valid: false, message: data.message || 'Code invalide' });
      }
    } catch {
      setPromoResult({ valid: false, message: 'Erreur de validation' });
    } finally {
      setPromoValidating(false);
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomClient: data.nomClient,
          telephone: data.telephone,
          adresse: data.adresse,
          commune: data.commune,
          codeWilaya: data.codeWilaya,
          items: [{ productId: product.id, quantite: quantity }],
          affiliateCode: data.affiliateCode || undefined,
          promoCode: promoCode || undefined,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setOrderSuccess({
          orderId: result.orderId,
          orderNumber: result.orderNumber,
        });
      } else {
        alert(result.error || 'Erreur lors de la commande');
      }
    } catch {
      alert('Erreur de connexion');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Bonjour ! Je souhaite commander ${quantity}x ${product.name} (${formatPrice(total)}). Nom: ${watch('nomClient') || ''}, Tél: ${watch('telephone') || ''}`.trim()
  );
  const whatsappUrl = `https://wa.me/213550000000?text=${whatsappMessage}`;

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-scorbio-green rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Commande confirmée !
          </h1>
          <p className="text-muted-foreground mb-2">
            Merci pour votre commande. Nous la traiterons dans les plus brefs délais.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Numéro de commande : <span className="font-mono font-bold text-scorbio-green">{orderSuccess.orderNumber}</span>
          </p>
          <Card className="p-4 mb-6 bg-scorbio-green-pale border-scorbio-green/20">
            <div className="flex items-center justify-center gap-2 text-scorbio-green font-medium">
              <Banknote className="w-5 h-5" />
              Paiement à la livraison
            </div>
          </Card>
          <p className="text-sm text-muted-foreground">
            Vous recevrez un SMS de confirmation. Notre livreur vous contactera pour la livraison.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 md:py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            Finaliser votre commande
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Order Form - Left */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Product Summary - Mobile */}
                <Card className="p-4 lg:hidden border-border shadow-soft">
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-scorbio-green-pale flex-shrink-0">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.tagline}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-scorbio-green">{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Contact Info */}
                <Card className="p-6 border-border shadow-soft">
                  <h2 className="text-lg font-semibold mb-4">Informations personnelles</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nomClient">Nom complet *</Label>
                      <Input
                        id="nomClient"
                        placeholder="Votre nom complet"
                        {...register('nomClient')}
                        className="mt-1"
                      />
                      {errors.nomClient && (
                        <p className="text-sm text-red-500 mt-1">{errors.nomClient.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="telephone">Téléphone *</Label>
                      <Input
                        id="telephone"
                        placeholder="0550123456"
                        {...register('telephone')}
                        className="mt-1"
                      />
                      {errors.telephone && (
                        <p className="text-sm text-red-500 mt-1">{errors.telephone.message}</p>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Delivery Info */}
                <Card className="p-6 border-border shadow-soft">
                  <h2 className="text-lg font-semibold mb-4">Adresse de livraison</h2>
                  <div className="space-y-4">
                    <div>
                      <Label>Wilaya *</Label>
                      <Select onValueChange={(val) => setValue('codeWilaya', val)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Sélectionnez votre wilaya" />
                        </SelectTrigger>
                        <SelectContent className="max-h-64">
                          {wilayas.map((w) => (
                            <SelectItem key={w.code} value={w.code}>
                              {w.code} - {w.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.codeWilaya && (
                        <p className="text-sm text-red-500 mt-1">{errors.codeWilaya.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="commune">Commune *</Label>
                      <Input
                        id="commune"
                        placeholder="Votre commune"
                        {...register('commune')}
                        className="mt-1"
                      />
                      {errors.commune && (
                        <p className="text-sm text-red-500 mt-1">{errors.commune.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="adresse">Adresse complète *</Label>
                      <Textarea
                        id="adresse"
                        placeholder="Numéro, rue, quartier..."
                        {...register('adresse')}
                        className="mt-1"
                      />
                      {errors.adresse && (
                        <p className="text-sm text-red-500 mt-1">{errors.adresse.message}</p>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Promo & Affiliate */}
                <Card className="p-6 border-border shadow-soft">
                  <h2 className="text-lg font-semibold mb-4">Codes & Réductions</h2>
                  <div className="space-y-4">
                    <div>
                      <Label>Code promo</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          placeholder="BIENVENUE10"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={validatePromo}
                          disabled={promoValidating || !promoCode.trim()}
                        >
                          {promoValidating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Tag className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <AnimatePresence>
                        {promoResult && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`text-sm mt-1 ${
                              promoResult.valid ? 'text-scorbio-green' : 'text-red-500'
                            }`}
                          >
                            {promoResult.valid ? <Check className="w-3 h-3 inline mr-1" /> : null}
                            {promoResult.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <div>
                      <Label htmlFor="affiliateCode">Code affilié</Label>
                      <Input
                        id="affiliateCode"
                        placeholder="SCORBIO_VOTRE_NOM"
                        {...register('affiliateCode')}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </Card>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-14 text-lg font-semibold bg-gradient-green hover:opacity-90 text-white rounded-xl shadow-lg"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <ShoppingCart className="w-5 h-5 mr-2" />
                  )}
                  {submitting ? 'Traitement en cours...' : 'Confirmer la commande'}
                </Button>

                {/* Cash on delivery note */}
                <div className="flex items-center justify-center gap-2 text-scorbio-green font-medium bg-scorbio-green-pale rounded-xl p-4">
                  <Banknote className="w-5 h-5" />
                  Paiement à la livraison
                </div>

                {/* WhatsApp alternative */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-14 text-lg font-semibold bg-[#25D366] hover:bg-[#1da851] text-white rounded-xl shadow-lg transition-colors gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Commander via WhatsApp
                </a>
              </form>
            </div>

            {/* Order Summary - Desktop */}
            <div className="lg:col-span-2">
              <div className="sticky top-8 space-y-4">
                <Card className="p-6 border-border shadow-soft hidden lg:block">
                  <h2 className="text-lg font-semibold mb-4">Récapitulatif</h2>
                  <div className="flex gap-4 mb-6">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-scorbio-green-pale flex-shrink-0">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.tagline}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-scorbio-green">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b">
                    <span className="text-sm font-medium">Quantité</span>
                    <div className="flex items-center border border-border rounded-lg">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="h-8 w-8"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-semibold text-sm">{quantity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="h-8 w-8"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-scorbio-green">Réduction</span>
                        <span className="text-scorbio-green">-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span className="text-scorbio-green">{formatPrice(total)}</span>
                    </div>
                  </div>
                </Card>

                {/* Mobile Summary (total only) */}
                <Card className="p-4 lg:hidden border-border shadow-soft">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm">Quantité</span>
                    <div className="flex items-center border border-border rounded-lg">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="h-8 w-8"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-semibold text-sm">{quantity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="h-8 w-8"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-scorbio-green">
                        <span>Réduction</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 mt-2 border-t">
                    <span>Total</span>
                    <span className="text-scorbio-green">{formatPrice(total)}</span>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
