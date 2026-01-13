import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Package, 
  Star, 
  Settings, 
  LogOut, 
  ChevronRight,
  Award,
  Clock,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useLoyaltyPoints } from '@/hooks/useLoyaltyPoints';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  items: any[];
}

const MyAccount = () => {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { points, transactions, fetchPoints, fetchTransactions } = useLoyaltyPoints();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile?.email) {
      fetchPoints(profile.email);
      fetchTransactions(profile.email);
      fetchOrders();
    }
  }, [profile]);

  const fetchOrders = async () => {
    if (!profile?.email) return;
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', profile.email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setOrders(data?.map(order => ({
        ...order,
        items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
      })) || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Até logo!",
      description: "Você saiu da sua conta.",
    });
    navigate('/');
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmado', className: 'bg-blue-100 text-blue-800' },
      processing: { label: 'Preparando', className: 'bg-purple-100 text-purple-800' },
      shipped: { label: 'Enviado', className: 'bg-indigo-100 text-indigo-800' },
      delivered: { label: 'Entregue', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelado', className: 'bg-red-100 text-red-800' },
    };
    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  // Calculate tier based on total points earned
  const getTier = () => {
    const totalEarned = points?.total_earned || 0;
    if (totalEarned >= 5000) return { name: 'Diamante', color: 'text-primary', icon: '💎' };
    if (totalEarned >= 2000) return { name: 'Ouro', color: 'text-yellow-500', icon: '🥇' };
    if (totalEarned >= 500) return { name: 'Prata', color: 'text-gray-400', icon: '🥈' };
    return { name: 'Bronze', color: 'text-orange-400', icon: '🥉' };
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return null;

  const tier = getTier();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-display font-bold text-foreground">
                    Olá, {profile?.full_name || 'Cliente'}!
                  </h1>
                  <p className="text-muted-foreground">{profile?.email}</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Seus Pontos</p>
                      <p className="text-3xl font-bold text-primary">{points?.points || 0}</p>
                    </div>
                    <Star className="w-10 h-10 text-primary/50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Nível</p>
                      <p className={`text-2xl font-bold ${tier.color}`}>
                        {tier.icon} {tier.name}
                      </p>
                    </div>
                    <Award className="w-10 h-10 text-muted-foreground/50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Pedidos</p>
                      <p className="text-3xl font-bold text-foreground">{orders.length}</p>
                    </div>
                    <Package className="w-10 h-10 text-muted-foreground/50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="orders" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 max-w-md">
                <TabsTrigger value="orders">Pedidos</TabsTrigger>
                <TabsTrigger value="points">Pontos</TabsTrigger>
                <TabsTrigger value="settings">Perfil</TabsTrigger>
              </TabsList>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Meus Pedidos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingOrders ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">Você ainda não fez nenhum pedido</p>
                        <Button asChild variant="premium">
                          <Link to="/catalogo">Explorar Catálogo</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <Link
                            key={order.id}
                            to={`/rastreamento?q=${order.order_number}`}
                            className="block"
                          >
                            <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                  <Package className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <div>
                                  <p className="font-medium">Pedido #{order.order_number}</p>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(order.created_at)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="font-medium">{formatPrice(order.total_amount)}</p>
                                  {getStatusBadge(order.status)}
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Points Tab */}
              <TabsContent value="points">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Programa de Fidelidade
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Pontos Disponíveis</p>
                        <p className="text-2xl font-bold text-primary">{points?.points || 0}</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Acumulado</p>
                        <p className="text-2xl font-bold">{points?.total_earned || 0}</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Resgatado</p>
                        <p className="text-2xl font-bold">{points?.total_redeemed || 0}</p>
                      </div>
                    </div>

                    <h3 className="font-medium mb-4">Histórico de Transações</h3>
                    {transactions.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        Nenhuma transação encontrada
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {transactions.map((tx) => (
                          <div
                            key={tx.id}
                            className="flex items-center justify-between p-3 border border-border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{tx.description || tx.type}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(tx.created_at).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                            <p className={`font-bold ${tx.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                              {tx.type === 'earned' ? '+' : '-'}{tx.points} pts
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-6 pt-6 border-t border-border">
                      <Button asChild variant="premium-outline" className="w-full">
                        <Link to="/fidelidade">Ver Programa Completo</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Meu Perfil
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-muted-foreground">Nome</label>
                        <p className="font-medium">{profile?.full_name || '-'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">E-mail</label>
                        <p className="font-medium">{profile?.email}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Telefone</label>
                        <p className="font-medium">{profile?.phone || '-'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Membro desde</label>
                        <p className="font-medium">
                          {profile?.created_at 
                            ? new Date(profile.created_at).toLocaleDateString('pt-BR', {
                                month: 'long',
                                year: 'numeric',
                              })
                            : '-'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MyAccount;
