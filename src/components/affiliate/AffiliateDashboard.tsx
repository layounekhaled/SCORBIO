'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Check,
  MessageCircle,
  Facebook,
  Link2,
  Users,
  DollarSign,
  TrendingUp,
  Loader2,
  UserPlus,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AffiliateData {
  id: string;
  code: string;
  name: string;
  commissionRate: number;
  totalSales: number;
  totalCommissions: number;
  recentOrders: Array<{
    id: string;
    nomClient: string;
    montant: number;
    status: string;
    createdAt: string;
    items: Array<{
      produit: string;
      quantite: number;
      prix: number;
    }>;
  }>;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('fr-DZ').format(price) + ' DA';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AffiliateDashboard() {
  const [mode, setMode] = useState<'register' | 'dashboard'>('register');
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
  const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Registration form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regError, setRegError] = useState('');

  // Check localStorage for saved affiliate code
  useEffect(() => {
    const savedCode = localStorage.getItem('scorbio_affiliate_code');
    if (savedCode) {
      setAffiliateCode(savedCode);
      setMode('dashboard');
    }
  }, []);

  // Fetch affiliate data
  useEffect(() => {
    if (affiliateCode && mode === 'dashboard') {
      fetchAffiliateData(affiliateCode);
    }
  }, [affiliateCode, mode]);

  const fetchAffiliateData = async (code: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/affiliates?code=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (res.ok) {
        setAffiliateData(data.affiliate);
      } else {
        setMode('register');
        localStorage.removeItem('scorbio_affiliate_code');
      }
    } catch {
      console.error('Failed to fetch affiliate data');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setRegError('Le nom est requis');
      return;
    }
    setLoading(true);
    setRegError('');
    try {
      const res = await fetch('/api/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail || undefined,
          phone: regPhone || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const code = data.affiliate.code;
        setAffiliateCode(code);
        localStorage.setItem('scorbio_affiliate_code', code);
        setMode('dashboard');
      } else {
        setRegError(data.error || 'Erreur lors de l\'inscription');
      }
    } catch {
      setRegError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const referralLink = typeof window !== 'undefined'
    ? `${window.location.origin}/?ref=${affiliateCode}`
    : `https://scorbio.dz/?ref=${affiliateCode}`;

  const whatsappShare = encodeURIComponent(
    `Découvrez les produits naturels SCORBIO ! 🌿 Commandez via mon lien : ${referralLink}`
  );

  const statusLabels: Record<string, string> = {
    en_preparation_stock: 'En préparation',
    expediee: 'Expédiée',
    en_livraison: 'En livraison',
    livree: 'Livrée',
    annulee: 'Annulée',
    retournee: 'Retournée',
  };

  const statusColors: Record<string, string> = {
    en_preparation_stock: 'bg-yellow-100 text-yellow-800',
    expediee: 'bg-blue-100 text-blue-800',
    en_livraison: 'bg-purple-100 text-purple-800',
    livree: 'bg-green-100 text-green-800',
    annulee: 'bg-red-100 text-red-800',
    retournee: 'bg-gray-100 text-gray-800',
  };

  // Registration Form
  if (mode === 'register') {
    return (
      <div className="min-h-screen bg-background py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-scorbio-green rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Programme d&apos;affiliation SCORBIO
              </h1>
              <p className="text-muted-foreground">
                Gagnez {20}% de commission sur chaque vente que vous référez !
              </p>
            </div>

            <Card className="p-6 md:p-8 shadow-soft border-border">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="regName">Nom complet *</Label>
                  <Input
                    id="regName"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Votre nom complet"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="regEmail">Email</Label>
                  <Input
                    id="regEmail"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="regPhone">Téléphone</Label>
                  <Input
                    id="regPhone"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0550123456"
                    className="mt-1"
                  />
                </div>

                {regError && (
                  <p className="text-sm text-red-500">{regError}</p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-base font-semibold bg-gradient-green hover:opacity-90 text-white rounded-xl"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <UserPlus className="w-5 h-5 mr-2" />
                  )}
                  Devenir affilié
                </Button>
              </form>
            </Card>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Déjà affilié ? Entrez votre code :
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="SCORBIO_VOTRE_NOM"
                  onChange={(e) => setAffiliateCode(e.target.value.toUpperCase())}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    if (affiliateCode) {
                      localStorage.setItem('scorbio_affiliate_code', affiliateCode);
                      setMode('dashboard');
                    }
                  }}
                >
                  Accéder
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Dashboard
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-scorbio-green" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Tableau de bord affilié
            </h1>
            <p className="text-muted-foreground">Bienvenue, {affiliateData?.name}</p>
          </motion.div>

          {/* Affiliate Code & Link */}
          <motion.div variants={fadeInUp}>
            <Card className="p-6 shadow-soft border-border mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Votre code affilié</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-lg font-bold text-scorbio-green bg-scorbio-green-pale px-3 py-1 rounded-lg">
                      {affiliateData?.code}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(affiliateData?.code || '', 'code')}
                    >
                      {copied === 'code' ? (
                        <Check className="w-4 h-4 text-scorbio-green" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Lien de parrainage</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm text-foreground bg-muted px-3 py-1.5 rounded-lg truncate max-w-[200px] md:max-w-[300px]">
                      {referralLink}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(referralLink, 'link')}
                    >
                      {copied === 'link' ? (
                        <Check className="w-4 h-4 text-scorbio-green" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Share buttons */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                <a
                  href={`https://wa.me/?text=${whatsappShare}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg text-sm font-medium hover:bg-[#1da851] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg text-sm font-medium hover:bg-[#1565C0] transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                  Facebook
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(referralLink, 'share')}
                  className="flex items-center gap-2"
                >
                  {copied === 'share' ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Link2 className="w-4 h-4" />
                  )}
                  Copier le lien
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card className="p-5 shadow-soft border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-scorbio-green-pale rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-scorbio-green" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ventes totales</p>
                  <p className="text-xl font-bold text-foreground">{formatPrice(affiliateData?.totalSales || 0)}</p>
                </div>
              </div>
            </Card>
            <Card className="p-5 shadow-soft border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-scorbio-gold/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-scorbio-gold" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Commissions gagnées</p>
                  <p className="text-xl font-bold text-foreground">{formatPrice(affiliateData?.totalCommissions || 0)}</p>
                </div>
              </div>
            </Card>
            <Card className="p-5 shadow-soft border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-scorbio-green-pale rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-scorbio-green" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taux de commission</p>
                  <p className="text-xl font-bold text-foreground">{affiliateData?.commissionRate}%</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Recent Orders */}
          <motion.div variants={fadeInUp}>
            <Card className="p-6 shadow-soft border-border">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-scorbio-green" />
                Commandes récentes
              </h2>
              {affiliateData?.recentOrders && affiliateData.recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">Client</th>
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">Montant</th>
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">Statut</th>
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {affiliateData.recentOrders.map((order) => (
                        <tr key={order.id} className="border-b last:border-0">
                          <td className="py-3 px-2">{order.nomClient}</td>
                          <td className="py-3 px-2 font-medium">{formatPrice(order.montant)}</td>
                          <td className="py-3 px-2">
                            <Badge
                              variant="outline"
                              className={statusColors[order.status] || ''}
                            >
                              {statusLabels[order.status] || order.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-2 text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ExternalLink className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>Aucune commande pour le moment</p>
                  <p className="text-sm">Partagez votre lien pour commencer à gagner !</p>
                </div>
              )}
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
