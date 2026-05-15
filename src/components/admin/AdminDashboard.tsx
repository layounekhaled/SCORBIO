'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  Loader2,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  DollarSign,
  TrendingUp,
  Edit2,
  Check,
  X,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#4A7C59', '#C5A55A', '#6B9E7A', '#D4BC7C', '#8B7355'];

const formatPrice = (price: number) =>
  new Intl.NumberFormat('fr-DZ').format(price) + ' DA';

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

interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalAffiliates: number;
  totalProducts: number;
}

interface Order {
  id: string;
  nomClient: string;
  telephone: string;
  adresse: string;
  commune: string;
  codeWilaya: string;
  wilayaName: string;
  montant: number;
  status: string;
  affiliateCode: string | null;
  promoCode: string | null;
  discount: number;
  createdAt: string;
  items: Array<{
    id: string;
    produit: string;
    quantite: number;
    prix: number;
  }>;
  affiliate?: { code: string; name: string } | null;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice: number | null;
  stock: number;
  active: boolean;
  category: string;
  orderIndex: number;
}

interface AffiliateInfo {
  id: string;
  code: string;
  name: string;
  email: string | null;
  phone: string | null;
  commissionRate: number;
  totalSales: number;
  totalCommissions: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [affiliates, setAffiliates] = useState<AffiliateInfo[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<Array<{ status: string; count: number }>>([]);
  const [topProducts, setTopProducts] = useState<Array<{ name: string; totalQuantity: number }>>([]);
  const [loading, setLoading] = useState(false);

  // Editing states
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setLoggedIn(true);
      } else {
        setLoginError(data.error || 'Identifiants incorrects');
      }
    } catch {
      setLoginError('Erreur de connexion');
    } finally {
      setLoginLoading(false);
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, productsRes, affiliatesRes] = await Promise.all([
        fetch('/api/admin'),
        fetch('/api/admin/orders'),
        fetch('/api/admin/products'),
        fetch('/api/admin/affiliates'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
        setOrdersByStatus(statsData.ordersByStatus || []);
        setTopProducts(statsData.topProducts || []);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders);
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.products);
      }

      if (affiliatesRes.ok) {
        const affiliatesData = await affiliatesRes.json();
        setAffiliates(affiliatesData.affiliates);
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) {
      fetchData();
    }
  }, [loggedIn, fetchData]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o))
        );
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const updateProductPrice = async (productId: string, price: number) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, price }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, price } : p))
        );
        setEditingPrice(null);
      }
    } catch (error) {
      console.error('Failed to update product price:', error);
    }
  };

  // Login screen
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-scorbio-green rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Administration SCORBIO</h1>
            <p className="text-muted-foreground mt-1">Connectez-vous pour accéder au tableau de bord</p>
          </div>

          <Card className="p-6 shadow-soft border-border">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@scorbio.dz"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••"
                  className="mt-1"
                />
              </div>
              {loginError && (
                <p className="text-sm text-red-500">{loginError}</p>
              )}
              <Button
                type="submit"
                disabled={loginLoading}
                className="w-full h-12 font-semibold bg-gradient-green hover:opacity-90 text-white rounded-xl"
              >
                {loginLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Lock className="w-5 h-5 mr-2" />
                )}
                Se connecter
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-scorbio-green" />
      </div>
    );
  }

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  return (
    <div className="min-h-screen bg-background py-6 md:py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Administration
            </h1>
            <p className="text-muted-foreground">Tableau de bord SCORBIO</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setLoggedIn(false)}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Button>
        </div>

        {/* Stats overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 md:p-5 shadow-soft border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-scorbio-green-pale rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-scorbio-green" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Revenu total</p>
                  <p className="text-lg font-bold">{formatPrice(stats.totalRevenue)}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 md:p-5 shadow-soft border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-scorbio-green-pale rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-scorbio-green" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Commandes</p>
                  <p className="text-lg font-bold">{stats.totalOrders}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 md:p-5 shadow-soft border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-scorbio-gold/10 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-scorbio-gold" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Affiliés</p>
                  <p className="text-lg font-bold">{stats.totalAffiliates}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 md:p-5 shadow-soft border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-scorbio-green-pale rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-scorbio-green" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Produits</p>
                  <p className="text-lg font-bold">{stats.totalProducts}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="commandes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="commandes" className="gap-1 text-xs sm:text-sm">
              <ShoppingBag className="w-4 h-4 hidden sm:block" />
              Commandes
            </TabsTrigger>
            <TabsTrigger value="produits" className="gap-1 text-xs sm:text-sm">
              <Package className="w-4 h-4 hidden sm:block" />
              Produits
            </TabsTrigger>
            <TabsTrigger value="affilies" className="gap-1 text-xs sm:text-sm">
              <Users className="w-4 h-4 hidden sm:block" />
              Affiliés
            </TabsTrigger>
            <TabsTrigger value="statistiques" className="gap-1 text-xs sm:text-sm">
              <BarChart3 className="w-4 h-4 hidden sm:block" />
              Stats
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="commandes">
            <Card className="p-4 md:p-6 shadow-soft border-border">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h2 className="text-lg font-semibold">Commandes ({filteredOrders.length})</h2>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="en_preparation_stock">En préparation</SelectItem>
                    <SelectItem value="expediee">Expédiée</SelectItem>
                    <SelectItem value="en_livraison">En livraison</SelectItem>
                    <SelectItem value="livree">Livrée</SelectItem>
                    <SelectItem value="annulee">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Client</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Montant</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Wilaya</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Statut</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-medium">{order.nomClient}</p>
                            <p className="text-xs text-muted-foreground">{order.telephone}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2 font-medium">{formatPrice(order.montant)}</td>
                        <td className="py-3 px-2">{order.wilayaName}</td>
                        <td className="py-3 px-2">
                          <Badge variant="outline" className={statusColors[order.status] || ''}>
                            {statusLabels[order.status] || order.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="py-3 px-2">
                          <Select
                            onValueChange={(val) => updateOrderStatus(order.id, val)}
                          >
                            <SelectTrigger className="h-8 w-[130px] text-xs">
                              <SelectValue placeholder="Changer" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en_preparation_stock">En préparation</SelectItem>
                              <SelectItem value="expediee">Expédiée</SelectItem>
                              <SelectItem value="en_livraison">En livraison</SelectItem>
                              <SelectItem value="livree">Livrée</SelectItem>
                              <SelectItem value="annulee">Annulée</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="produits">
            <Card className="p-4 md:p-6 shadow-soft border-border">
              <h2 className="text-lg font-semibold mb-4">Produits ({products.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Produit</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Prix</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Prix original</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Stock</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Statut</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.tagline}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          {editingPrice === product.id ? (
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={editPriceValue}
                                onChange={(e) => setEditPriceValue(Number(e.target.value))}
                                className="w-24 h-8 text-sm"
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => updateProductPrice(product.id, editPriceValue)}
                              >
                                <Check className="w-4 h-4 text-scorbio-green" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => setEditingPrice(null)}
                              >
                                <X className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          ) : (
                            <span className="font-medium">{formatPrice(product.price)}</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">
                          {product.originalPrice ? formatPrice(product.originalPrice) : '-'}
                        </td>
                        <td className="py-3 px-2">{product.stock}</td>
                        <td className="py-3 px-2">
                          <Badge variant={product.active ? 'default' : 'secondary'}>
                            {product.active ? 'Actif' : 'Inactif'}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingPrice(product.id);
                              setEditPriceValue(product.price);
                            }}
                            disabled={editingPrice === product.id}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Affiliates Tab */}
          <TabsContent value="affilies">
            <Card className="p-4 md:p-6 shadow-soft border-border">
              <h2 className="text-lg font-semibold mb-4">Affiliés ({affiliates.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Nom</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Code</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Ventes</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Commissions</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Taux</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Inscrit le</th>
                    </tr>
                  </thead>
                  <tbody>
                    {affiliates.map((affiliate) => (
                      <tr key={affiliate.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-medium">{affiliate.name}</p>
                            <p className="text-xs text-muted-foreground">{affiliate.email || affiliate.phone || '-'}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded">{affiliate.code}</code>
                        </td>
                        <td className="py-3 px-2 font-medium">{formatPrice(affiliate.totalSales)}</td>
                        <td className="py-3 px-2 font-medium text-scorbio-gold">
                          {formatPrice(affiliate.totalCommissions)}
                        </td>
                        <td className="py-3 px-2">{affiliate.commissionRate}%</td>
                        <td className="py-3 px-2 text-muted-foreground">
                          {new Date(affiliate.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistiques">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Orders by Status */}
              <Card className="p-4 md:p-6 shadow-soft border-border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-scorbio-green" />
                  Commandes par statut
                </h3>
                {ordersByStatus.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={ordersByStatus.map((obs) => ({
                          name: statusLabels[obs.status] || obs.status,
                          value: obs.count,
                        }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {ordersByStatus.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Aucune donnée disponible
                  </div>
                )}
              </Card>

              {/* Top Products */}
              <Card className="p-4 md:p-6 shadow-soft border-border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-scorbio-green" />
                  Produits les plus vendus
                </h3>
                {topProducts.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topProducts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="totalQuantity" fill="#4A7C59" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Aucune donnée disponible
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
