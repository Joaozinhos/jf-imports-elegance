import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Shield,
  Package,
  Tag,
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  Truck,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Lock,
} from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  total_amount: number;
  shipping_amount: number;
  status: string;
  payment_method: string | null;
  tracking_code: string | null;
  created_at: string;
  items: any;
}

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  min_purchase: number | null;
  max_uses: number | null;
  used_count: number;
  active: boolean;
  expires_at: string | null;
}

const ADMIN_PASSWORD = "jfimports2024";

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"orders" | "coupons">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dialog states
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [couponDialogOpen, setCouponDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingCode, setTrackingCode] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  
  // Coupon form
  const [couponForm, setCouponForm] = useState({
    code: "",
    type: "percentage",
    value: "",
    min_purchase: "",
    max_uses: "",
    expires_at: "",
  });
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success("Login realizado com sucesso!");
    } else {
      toast.error("Senha incorreta");
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      toast.error("Erro ao carregar pedidos");
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const fetchCoupons = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      toast.error("Erro ao carregar cupons");
    } else {
      setCoupons(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchCoupons();
    }
  }, [isAuthenticated]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("pt-BR");
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; icon: any }> = {
      pending: { bg: "bg-yellow-500/10", text: "text-yellow-500", icon: Clock },
      paid: { bg: "bg-green-500/10", text: "text-green-500", icon: CheckCircle },
      shipped: { bg: "bg-blue-500/10", text: "text-blue-500", icon: Truck },
      delivered: { bg: "bg-primary/10", text: "text-primary", icon: Package },
      cancelled: { bg: "bg-red-500/10", text: "text-red-500", icon: XCircle },
    };
    
    const style = styles[status] || styles.pending;
    const Icon = style.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs ${style.bg} ${style.text} rounded`}>
        <Icon className="w-3 h-3" />
        {status === "pending" && "Pendente"}
        {status === "paid" && "Pago"}
        {status === "shipped" && "Enviado"}
        {status === "delivered" && "Entregue"}
        {status === "cancelled" && "Cancelado"}
      </span>
    );
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;

    const updates: any = {};
    if (trackingCode) updates.tracking_code = trackingCode;
    if (orderStatus) updates.status = orderStatus;

    const { error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", selectedOrder.id);

    if (error) {
      toast.error("Erro ao atualizar pedido");
    } else {
      toast.success("Pedido atualizado!");
      fetchOrders();
      setOrderDialogOpen(false);
      setSelectedOrder(null);
      setTrackingCode("");
      setOrderStatus("");
      
      // Send email if shipped
      if (orderStatus === "shipped" && trackingCode) {
        await supabase.functions.invoke("send-order-email", {
          body: {
            type: "shipped",
            order: { ...selectedOrder, tracking_code: trackingCode, status: orderStatus },
          },
        });
      }
    }
  };

  const handleCreateCoupon = async () => {
    const couponData = {
      code: couponForm.code.toUpperCase(),
      type: couponForm.type,
      value: parseFloat(couponForm.value),
      min_purchase: couponForm.min_purchase ? parseFloat(couponForm.min_purchase) : null,
      max_uses: couponForm.max_uses ? parseInt(couponForm.max_uses) : null,
      expires_at: couponForm.expires_at || null,
      active: true,
    };

    if (editingCoupon) {
      const { error } = await supabase
        .from("coupons")
        .update(couponData)
        .eq("id", editingCoupon.id);

      if (error) {
        toast.error("Erro ao atualizar cupom");
      } else {
        toast.success("Cupom atualizado!");
        fetchCoupons();
        setCouponDialogOpen(false);
        resetCouponForm();
      }
    } else {
      const { error } = await supabase.from("coupons").insert([couponData]);

      if (error) {
        toast.error("Erro ao criar cupom");
      } else {
        toast.success("Cupom criado!");
        fetchCoupons();
        setCouponDialogOpen(false);
        resetCouponForm();
      }
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Deseja realmente excluir este cupom?")) return;

    const { error } = await supabase.from("coupons").delete().eq("id", id);

    if (error) {
      toast.error("Erro ao excluir cupom");
    } else {
      toast.success("Cupom excluído!");
      fetchCoupons();
    }
  };

  const handleToggleCoupon = async (coupon: Coupon) => {
    const { error } = await supabase
      .from("coupons")
      .update({ active: !coupon.active })
      .eq("id", coupon.id);

    if (error) {
      toast.error("Erro ao atualizar cupom");
    } else {
      fetchCoupons();
    }
  };

  const resetCouponForm = () => {
    setCouponForm({
      code: "",
      type: "percentage",
      value: "",
      min_purchase: "",
      max_uses: "",
      expires_at: "",
    });
    setEditingCoupon(null);
  };

  const openEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCouponForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value.toString(),
      min_purchase: coupon.min_purchase?.toString() || "",
      max_uses: coupon.max_uses?.toString() || "",
      expires_at: coupon.expires_at ? coupon.expires_at.split("T")[0] : "",
    });
    setCouponDialogOpen(true);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-secondary/30 border border-divider p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-display text-foreground mb-2">
              Área Administrativa
            </h1>
            <p className="text-muted-foreground">
              Digite a senha para acessar o painel
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <Button variant="premium" className="w-full" onClick={handleLogin}>
              Entrar
            </Button>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-secondary/30 border-b border-divider">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-display text-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">JF Imports</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAuthenticated(false)}
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="border-b border-divider">
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-secondary/30 border border-divider p-4">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{orders.length}</p>
                  <p className="text-sm text-muted-foreground">Pedidos</p>
                </div>
              </div>
            </div>
            <div className="bg-secondary/30 border border-divider p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {orders.filter((o) => o.status === "pending").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                </div>
              </div>
            </div>
            <div className="bg-secondary/30 border border-divider p-4">
              <div className="flex items-center gap-3">
                <Tag className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {coupons.filter((c) => c.active).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Cupons Ativos</p>
                </div>
              </div>
            </div>
            <div className="bg-secondary/30 border border-divider p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {formatPrice(orders.reduce((sum, o) => sum + o.total_amount, 0))}
                  </p>
                  <p className="text-sm text-muted-foreground">Receita Total</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="container mx-auto px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant={activeTab === "orders" ? "premium" : "outline"}
            onClick={() => setActiveTab("orders")}
            className="gap-2"
          >
            <Package className="w-4 h-4" />
            Pedidos
          </Button>
          <Button
            variant={activeTab === "coupons" ? "premium" : "outline"}
            onClick={() => setActiveTab("coupons")}
            className="gap-2"
          >
            <Tag className="w-4 h-4" />
            Cupons
          </Button>
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número, nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={fetchOrders} disabled={loading}>
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>

            <div className="border border-divider overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rastreio</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.order_number}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatPrice(order.total_amount)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        {order.tracking_code || (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(order.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog open={orderDialogOpen && selectedOrder?.id === order.id} onOpenChange={(open) => {
                          setOrderDialogOpen(open);
                          if (!open) setSelectedOrder(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setTrackingCode(order.tracking_code || "");
                                setOrderStatus(order.status);
                                setOrderDialogOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Atualizar Pedido {order.order_number}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <Label>Status</Label>
                                <select
                                  value={orderStatus}
                                  onChange={(e) => setOrderStatus(e.target.value)}
                                  className="w-full border border-divider bg-background p-2 rounded mt-1"
                                >
                                  <option value="pending">Pendente</option>
                                  <option value="paid">Pago</option>
                                  <option value="shipped">Enviado</option>
                                  <option value="delivered">Entregue</option>
                                  <option value="cancelled">Cancelado</option>
                                </select>
                              </div>
                              <div>
                                <Label>Código de Rastreio</Label>
                                <Input
                                  value={trackingCode}
                                  onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                                  placeholder="Ex: BR123456789BR"
                                />
                              </div>
                              <Button variant="premium" className="w-full" onClick={handleUpdateOrder}>
                                Salvar Alterações
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Coupons Tab */}
        {activeTab === "coupons" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display text-foreground">Gerenciar Cupons</h2>
              <Dialog open={couponDialogOpen} onOpenChange={(open) => {
                setCouponDialogOpen(open);
                if (!open) resetCouponForm();
              }}>
                <DialogTrigger asChild>
                  <Button variant="premium" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Novo Cupom
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingCoupon ? "Editar Cupom" : "Criar Cupom"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label>Código</Label>
                      <Input
                        value={couponForm.code}
                        onChange={(e) =>
                          setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })
                        }
                        placeholder="DESCONTO10"
                      />
                    </div>
                    <div>
                      <Label>Tipo</Label>
                      <select
                        value={couponForm.type}
                        onChange={(e) =>
                          setCouponForm({ ...couponForm, type: e.target.value })
                        }
                        className="w-full border border-divider bg-background p-2 rounded mt-1"
                      >
                        <option value="percentage">Porcentagem (%)</option>
                        <option value="fixed">Valor Fixo (R$)</option>
                        <option value="free_shipping">Frete Grátis</option>
                      </select>
                    </div>
                    <div>
                      <Label>
                        Valor {couponForm.type === "percentage" ? "(%)" : "(R$)"}
                      </Label>
                      <Input
                        type="number"
                        value={couponForm.value}
                        onChange={(e) =>
                          setCouponForm({ ...couponForm, value: e.target.value })
                        }
                        placeholder={couponForm.type === "percentage" ? "10" : "50"}
                        disabled={couponForm.type === "free_shipping"}
                      />
                    </div>
                    <div>
                      <Label>Compra Mínima (R$)</Label>
                      <Input
                        type="number"
                        value={couponForm.min_purchase}
                        onChange={(e) =>
                          setCouponForm({ ...couponForm, min_purchase: e.target.value })
                        }
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <Label>Limite de Uso</Label>
                      <Input
                        type="number"
                        value={couponForm.max_uses}
                        onChange={(e) =>
                          setCouponForm({ ...couponForm, max_uses: e.target.value })
                        }
                        placeholder="Ilimitado"
                      />
                    </div>
                    <div>
                      <Label>Data de Expiração</Label>
                      <Input
                        type="date"
                        value={couponForm.expires_at}
                        onChange={(e) =>
                          setCouponForm({ ...couponForm, expires_at: e.target.value })
                        }
                      />
                    </div>
                    <Button variant="premium" className="w-full" onClick={handleCreateCoupon}>
                      {editingCoupon ? "Atualizar" : "Criar"} Cupom
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="border border-divider overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Mín. Compra</TableHead>
                    <TableHead>Uso</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-mono font-bold">{coupon.code}</TableCell>
                      <TableCell>
                        {coupon.type === "percentage" && "Porcentagem"}
                        {coupon.type === "fixed" && "Valor Fixo"}
                        {coupon.type === "free_shipping" && "Frete Grátis"}
                      </TableCell>
                      <TableCell>
                        {coupon.type === "percentage" && `${coupon.value}%`}
                        {coupon.type === "fixed" && formatPrice(coupon.value)}
                        {coupon.type === "free_shipping" && "-"}
                      </TableCell>
                      <TableCell>
                        {coupon.min_purchase ? formatPrice(coupon.min_purchase) : "-"}
                      </TableCell>
                      <TableCell>
                        {coupon.used_count} / {coupon.max_uses || "∞"}
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleToggleCoupon(coupon)}
                          className={`px-2 py-1 text-xs rounded ${
                            coupon.active
                              ? "bg-green-500/10 text-green-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {coupon.active ? "Ativo" : "Inativo"}
                        </button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditCoupon(coupon)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default AdminDashboard;