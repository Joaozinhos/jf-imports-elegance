import { Package, Clock, CheckCircle, XCircle, Tag, Users, DollarSign, TrendingUp } from "lucide-react";

interface Stats {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  averageTicket: number;
  newCustomers: number;
}

interface AdminKPIsProps {
  stats: Stats;
  activeCoupons: number;
  formatPrice: (value: number) => string;
}

const AdminKPIs = ({ stats, activeCoupons, formatPrice }: AdminKPIsProps) => {
  const kpis = [
    {
      icon: Package,
      value: stats.totalOrders,
      label: "Total Pedidos",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: CheckCircle,
      value: stats.completedOrders,
      label: "Concluídos",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Clock,
      value: stats.pendingOrders,
      label: "Pendentes",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      icon: XCircle,
      value: stats.cancelledOrders,
      label: "Cancelados",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      icon: DollarSign,
      value: formatPrice(stats.totalRevenue),
      label: "Receita Total",
      color: "text-primary",
      bgColor: "bg-primary/10",
      isString: true,
    },
    {
      icon: TrendingUp,
      value: formatPrice(stats.averageTicket),
      label: "Ticket Médio",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      isString: true,
    },
    {
      icon: Users,
      value: stats.newCustomers,
      label: "Novos Clientes",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      icon: Tag,
      value: activeCoupons,
      label: "Cupons Ativos",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className="bg-secondary/30 border border-divider p-4 hover:border-primary/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded ${kpi.bgColor}`}>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-foreground truncate">
                {kpi.isString ? kpi.value : kpi.value.toLocaleString('pt-BR')}
              </p>
              <p className="text-xs text-muted-foreground truncate">{kpi.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminKPIs;
