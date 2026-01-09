import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, Package, Tag, Users, Lock, ShoppingBag } from "lucide-react";
import AdminKPIs from "@/components/admin/AdminKPIs";
import AdminCharts from "@/components/admin/AdminCharts";
import AdminPeriodFilter from "@/components/admin/AdminPeriodFilter";
import AdminOrdersTable from "@/components/admin/AdminOrdersTable";
import AdminCustomersTab from "@/components/admin/AdminCustomersTab";
import AdminProductsTab from "@/components/admin/AdminProductsTab";

// Import existing coupon management UI
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, RefreshCw, CheckCircle, XCircle } from "lucide-react";

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

interface Customer {
  customer_email: string;
  customer_name: string;
  customer_phone: string | null;
  total_orders: number;
  total_spent: number;
  last_order_date: string;
  first_order_date: string;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  description: string | null;
  size: string;
  image: string;
  images: string[];
  notes: any;
  concentration: string | null;
  year: number | null;
  stock: number;
  active: boolean;
  created_at: string;
}

interface Stats {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  averageTicket: number;
  newCustomers: number;
}

interface ChartData {
  date: string;
  orders: number;
  revenue: number;
}

type TabType = "orders" | "coupons" | "customers" | "products";

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminSecret, setAdminSecret] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0, completedOrders: 0, cancelledOrders: 0, pendingOrders: 0,
    totalRevenue: 0, averageTicket: 0, newCustomers: 0,
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Coupon form state
  const [couponDialogOpen, setCouponDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponForm, setCouponForm] = useState({
    code: "", type: "percentage", value: "", min_purchase: "", max_uses: "", expires_at: "",
  });

  const adminCall = async (action: string, data?: any) => {
    const { data: result, error } = await supabase.functions.invoke("admin", {
      body: { action, data },
      headers: { "x-admin-secret": adminSecret },
    });
    if (error) throw error;
    if (result?.error) throw new Error(result.error);
    return result;
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin", {
        body: { action: "login", password },
      });
      if (error || data?.error) {
        toast.error(data?.error || "Erro ao fazer login");
        return;
      }
      setAdminSecret(password);
      setIsAuthenticated(true);
      toast.success("Login realizado com sucesso!");
    } catch (err) {
      toast.error("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const result = await adminCall("get_stats", { period: selectedPeriod });
      setStats(result.stats);
      setChartData(result.chartData);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const result = await adminCall("get_orders");
      setOrders(result.orders || []);
    } catch (err) {
      toast.error("Erro ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const fetchCoupons = async () => {
    try {
      const result = await adminCall("get_coupons");
      setCoupons(result.coupons || []);
    } catch (err) {
      toast.error("Erro ao carregar cupons");
    }
  };

  const fetchCustomers = async () => {
    try {
      const result = await adminCall("get_customers");
      setCustomers(result.customers || []);
    } catch (err) {
      toast.error("Erro ao carregar clientes");
    }
  };

  const fetchProducts = async () => {
    try {
      const result = await adminCall("get_products");
      setProducts(result.products || []);
    } catch (err) {
      toast.error("Erro ao carregar produtos");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      fetchOrders();
      fetchCoupons();
      fetchCustomers();
      fetchProducts();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [selectedPeriod]);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const formatDate = (date: string) => new Date(date).toLocaleString("pt-BR");

  // Order handlers
  const handleUpdateOrder = async (id: string, updates: any) => {
    await adminCall("update_order", { id, updates });
    toast.success("Pedido atualizado!");
    fetchOrders();
    fetchStats();
  };

  const handleResendEmail = async (orderId: string, type: string) => {
    await adminCall("resend_order_email", { orderId, type });
  };

  // Coupon handlers
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
    try {
      if (editingCoupon) {
        await adminCall("update_coupon", { id: editingCoupon.id, updates: couponData });
        toast.success("Cupom atualizado!");
      } else {
        await adminCall("create_coupon", couponData);
        toast.success("Cupom criado!");
      }
      fetchCoupons();
      setCouponDialogOpen(false);
      resetCouponForm();
    } catch (err) {
      toast.error("Erro ao salvar cupom");
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Deseja realmente excluir este cupom?")) return;
    try {
      await adminCall("delete_coupon", { id });
      toast.success("Cupom excluído!");
      fetchCoupons();
    } catch (err) {
      toast.error("Erro ao excluir cupom");
    }
  };

  const handleToggleCoupon = async (coupon: Coupon) => {
    try {
      await adminCall("toggle_coupon", { id: coupon.id, active: !coupon.active });
      fetchCoupons();
    } catch (err) {
      toast.error("Erro ao atualizar cupom");
    }
  };

  const resetCouponForm = () => {
    setCouponForm({ code: "", type: "percentage", value: "", min_purchase: "", max_uses: "", expires_at: "" });
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

  // Product handlers
  const handleCreateProduct = async (data: any) => {
    await adminCall("create_product", data);
    fetchProducts();
  };

  const handleUpdateProduct = async (id: string, updates: any) => {
    await adminCall("update_product", { id, updates });
    fetchProducts();
  };

  const handleDeleteProduct = async (id: string) => {
    await adminCall("delete_product", { id });
    fetchProducts();
  };

  const handleToggleProduct = async (id: string, active: boolean) => {
    await adminCall("toggle_product", { id, active });
    fetchProducts();
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-secondary/30 border border-divider p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-display text-foreground mb-2">Área Administrativa</h1>
            <p className="text-muted-foreground">Digite a senha para acessar o painel</p>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="password" type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="pl-10" placeholder="••••••••" />
              </div>
            </div>
            <Button variant="premium" className="w-full" onClick={handleLogin} disabled={loading}>
              {loading ? "Verificando..." : "Entrar"}
            </Button>
          </div>
        </motion.div>
      </main>
    );
  }

  const tabs = [
    { id: "orders", label: "Pedidos", icon: Package },
    { id: "coupons", label: "Cupons", icon: Tag },
    { id: "customers", label: "Clientes", icon: Users },
    { id: "products", label: "Produtos", icon: ShoppingBag },
  ];

  return (
    <main className="min-h-screen bg-background">
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
            <Button variant="outline" size="sm" onClick={() => { setIsAuthenticated(false); setAdminSecret(""); setPassword(""); }}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <section className="border-b border-divider">
        <div className="container mx-auto px-6 py-6 space-y-4">
          <AdminPeriodFilter selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />
          <AdminKPIs stats={stats} activeCoupons={coupons.filter((c) => c.active).length} formatPrice={formatPrice} />
          <AdminCharts data={chartData} formatPrice={formatPrice} />
        </div>
      </section>

      <section className="container mx-auto px-6 py-6">
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {tabs.map((tab) => (
            <Button key={tab.id} variant={activeTab === tab.id ? "premium" : "outline"}
              onClick={() => setActiveTab(tab.id as TabType)} className="gap-2">
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {activeTab === "orders" && (
          <AdminOrdersTable orders={orders} loading={loading} onRefresh={fetchOrders}
            onUpdateOrder={handleUpdateOrder} onResendEmail={handleResendEmail}
            formatPrice={formatPrice} formatDate={formatDate} />
        )}

        {activeTab === "coupons" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Dialog open={couponDialogOpen} onOpenChange={(open) => { setCouponDialogOpen(open); if (!open) resetCouponForm(); }}>
                <DialogTrigger asChild>
                  <Button variant="premium" className="gap-2"><Plus className="w-4 h-4" />Novo Cupom</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>{editingCoupon ? "Editar Cupom" : "Novo Cupom"}</DialogTitle></DialogHeader>
                  <div className="space-y-4 py-4">
                    <div><Label>Código</Label><Input value={couponForm.code} onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })} placeholder="DESCONTO10" /></div>
                    <div><Label>Tipo</Label><select value={couponForm.type} onChange={(e) => setCouponForm({ ...couponForm, type: e.target.value })} className="w-full mt-1 p-2 border border-divider bg-background rounded"><option value="percentage">Porcentagem (%)</option><option value="fixed">Valor Fixo (R$)</option></select></div>
                    <div><Label>Valor</Label><Input type="number" value={couponForm.value} onChange={(e) => setCouponForm({ ...couponForm, value: e.target.value })} /></div>
                    <div><Label>Compra Mínima (R$)</Label><Input type="number" value={couponForm.min_purchase} onChange={(e) => setCouponForm({ ...couponForm, min_purchase: e.target.value })} /></div>
                    <div><Label>Máximo de Usos</Label><Input type="number" value={couponForm.max_uses} onChange={(e) => setCouponForm({ ...couponForm, max_uses: e.target.value })} /></div>
                    <div><Label>Data de Expiração</Label><Input type="date" value={couponForm.expires_at} onChange={(e) => setCouponForm({ ...couponForm, expires_at: e.target.value })} /></div>
                    <Button variant="premium" className="w-full" onClick={handleCreateCoupon}>{editingCoupon ? "Atualizar" : "Criar"} Cupom</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={fetchCoupons} disabled={loading}><RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /></Button>
            </div>
            <div className="border border-divider overflow-hidden">
              <Table>
                <TableHeader><TableRow><TableHead>Código</TableHead><TableHead>Tipo</TableHead><TableHead>Valor</TableHead><TableHead>Min. Compra</TableHead><TableHead>Usos</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-medium">{coupon.code}</TableCell>
                      <TableCell>{coupon.type === "percentage" ? "%" : "R$"}</TableCell>
                      <TableCell>{coupon.type === "percentage" ? `${coupon.value}%` : formatPrice(coupon.value)}</TableCell>
                      <TableCell>{coupon.min_purchase ? formatPrice(coupon.min_purchase) : "-"}</TableCell>
                      <TableCell>{coupon.used_count}{coupon.max_uses ? ` / ${coupon.max_uses}` : ""}</TableCell>
                      <TableCell><Button variant="ghost" size="sm" onClick={() => handleToggleCoupon(coupon)} className={coupon.active ? "text-green-500" : "text-red-500"}>{coupon.active ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}</Button></TableCell>
                      <TableCell className="text-right"><div className="flex items-center justify-end gap-2"><Button variant="ghost" size="sm" onClick={() => openEditCoupon(coupon)}><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="sm" onClick={() => handleDeleteCoupon(coupon.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></Button></div></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {activeTab === "customers" && (
          <AdminCustomersTab customers={customers} loading={loading} onRefresh={fetchCustomers} formatPrice={formatPrice} formatDate={formatDate} />
        )}

        {activeTab === "products" && (
          <AdminProductsTab products={products} loading={loading} onRefresh={fetchProducts}
            onCreateProduct={handleCreateProduct} onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct} onToggleProduct={handleToggleProduct} formatPrice={formatPrice} />
        )}
      </section>
    </main>
  );
};

export default AdminDashboard;
