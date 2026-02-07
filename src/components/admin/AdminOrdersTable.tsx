import { useState } from "react";
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
} from "@/components/ui/dialog";
import {
  Search,
  RefreshCw,
  Edit,
  Eye,
  Mail,
  ExternalLink,
  ArrowUpDown,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  Package,
  Trash2,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_address: string | null;
  total_amount: number;
  shipping_amount: number;
  status: string;
  payment_method: string | null;
  tracking_code: string | null;
  created_at: string;
  items: any;
}

interface AdminOrdersTableProps {
  orders: Order[];
  loading: boolean;
  onRefresh: () => void;
  onUpdateOrder: (id: string, updates: any) => Promise<void>;
  onDeleteOrder: (id: string) => Promise<void>;
  onResendEmail: (orderId: string, type: string) => Promise<void>;
  formatPrice: (value: number) => string;
  formatDate: (date: string) => string;
}

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "pending", label: "Pendente" },
  { value: "paid", label: "Pago" },
  { value: "shipped", label: "Enviado" },
  { value: "delivered", label: "Entregue" },
  { value: "cancelled", label: "Cancelado" },
];

const AdminOrdersTable = ({
  orders,
  loading,
  onRefresh,
  onUpdateOrder,
  onDeleteOrder,
  onResendEmail,
  formatPrice,
  formatDate,
}: AdminOrdersTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  const [sortConfig, setSortConfig] = useState<{ key: string; order: "asc" | "desc" }>({
    key: "created_at",
    order: "desc",
  });
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingCode, setTrackingCode] = useState("");
  const [orderStatus, setOrderStatus] = useState("");

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
    const labels: Record<string, string> = {
      pending: "Pendente",
      paid: "Pago",
      shipped: "Enviado",
      delivered: "Entregue",
      cancelled: "Cancelado",
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs ${style.bg} ${style.text} rounded`}
      >
        <Icon className="w-3 h-3" />
        {labels[status] || status}
      </span>
    );
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      order: prev.key === key && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const handleSaveOrder = async () => {
    if (!selectedOrder) return;

    const updates: any = {};
    if (trackingCode !== (selectedOrder.tracking_code || "")) {
      updates.tracking_code = trackingCode;
    }
    if (orderStatus !== selectedOrder.status) {
      updates.status = orderStatus;
    }

    if (Object.keys(updates).length === 0) {
      toast.info("Nenhuma alteração detectada");
      return;
    }

    try {
      await onUpdateOrder(selectedOrder.id, updates);
      setOrderDialogOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      // Error handled in parent
    }
  };

  const handleQuickStatusChange = async (order: Order, newStatus: string) => {
    try {
      await onUpdateOrder(order.id, { status: newStatus });
    } catch (error) {
      // Error handled in parent
    }
  };

  const handleResendEmail = async (order: Order, type: string) => {
    try {
      await onResendEmail(order.id, type);
      toast.success("Email reenviado com sucesso!");
    } catch (error) {
      toast.error("Erro ao reenviar email");
    }
  };

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || order.status === statusFilter;

      const orderDate = new Date(order.created_at);
      const matchesDateStart = !dateFilter.start || orderDate >= new Date(dateFilter.start);
      const matchesDateEnd = !dateFilter.end || orderDate <= new Date(dateFilter.end + "T23:59:59");

      return matchesSearch && matchesStatus && matchesDateStart && matchesDateEnd;
    })
    .sort((a, b) => {
      const aVal = a[sortConfig.key as keyof Order];
      const bVal = b[sortConfig.key as keyof Order];

      if (sortConfig.key === "created_at" || sortConfig.key === "total_amount") {
        const aNum = sortConfig.key === "created_at" ? new Date(aVal as string).getTime() : Number(aVal);
        const bNum = sortConfig.key === "created_at" ? new Date(bVal as string).getTime() : Number(bVal);
        return sortConfig.order === "asc" ? aNum - bNum : bNum - aNum;
      }

      return sortConfig.order === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número, nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border border-divider bg-background rounded text-sm"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={dateFilter.start}
            onChange={(e) => setDateFilter((prev) => ({ ...prev, start: e.target.value }))}
            className="text-sm w-[140px]"
          />
          <span className="text-muted-foreground">até</span>
          <Input
            type="date"
            value={dateFilter.end}
            onChange={(e) => setDateFilter((prev) => ({ ...prev, end: e.target.value }))}
            className="text-sm w-[140px]"
          />
        </div>

        <Button variant="outline" onClick={onRefresh} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Table */}
      <div className="border border-divider overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:text-foreground"
                onClick={() => handleSort("order_number")}
              >
                <span className="flex items-center gap-1">
                  Pedido <ArrowUpDown className="w-3 h-3" />
                </span>
              </TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead
                className="cursor-pointer hover:text-foreground"
                onClick={() => handleSort("total_amount")}
              >
                <span className="flex items-center gap-1">
                  Total <ArrowUpDown className="w-3 h-3" />
                </span>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rastreio</TableHead>
              <TableHead
                className="cursor-pointer hover:text-foreground"
                onClick={() => handleSort("created_at")}
              >
                <span className="flex items-center gap-1">
                  Data <ArrowUpDown className="w-3 h-3" />
                </span>
              </TableHead>
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
                  {order.tracking_code ? (
                    <a
                      href={`https://www.linkcorreios.com.br/${order.tracking_code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                    >
                      {order.tracking_code}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(order.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setDetailsDialogOpen(true);
                      }}
                      title="Ver Detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setTrackingCode(order.tracking_code || "");
                        setOrderStatus(order.status);
                        setOrderDialogOpen(true);
                      }}
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResendEmail(order, "confirmation")}
                      title="Reenviar Email"
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Deseja realmente excluir o pedido ${order.order_number}?`)) {
                          onDeleteOrder(order.id);
                        }
                      }}
                      title="Excluir Pedido"
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

      <p className="text-sm text-muted-foreground">
        Mostrando {filteredOrders.length} de {orders.length} pedidos
      </p>

      {/* Edit Order Dialog */}
      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar Pedido {selectedOrder?.order_number}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Status</Label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="w-full mt-1 p-2 border border-divider bg-background rounded"
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
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="Ex: AA123456789BR"
              />
            </div>
            <Button variant="premium" className="w-full" onClick={handleSaveOrder}>
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido {selectedOrder?.order_number}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                  <p className="text-sm">{selectedOrder.customer_email}</p>
                  {selectedOrder.customer_phone && (
                    <p className="text-sm">{selectedOrder.customer_phone}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(selectedOrder.status)}
                  <p className="text-sm mt-2 text-muted-foreground">
                    Pagamento: {selectedOrder.payment_method || "-"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Itens</p>
                <div className="bg-secondary/30 border border-divider p-4 rounded space-y-2">
                  {Array.isArray(selectedOrder.items) &&
                    selectedOrder.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  <div className="border-t border-divider pt-2 mt-2">
                    <div className="flex justify-between text-sm">
                      <span>Frete</span>
                      <span>{formatPrice(selectedOrder.shipping_amount)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatPrice(selectedOrder.total_amount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedOrder.customer_address && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Endereço de Entrega
                  </p>
                  <p className="font-medium mt-1">{selectedOrder.customer_address}</p>
                </div>
              )}

              {selectedOrder.tracking_code && (
                <div>
                  <p className="text-sm text-muted-foreground">Rastreio</p>
                  <a
                    href={`https://www.linkcorreios.com.br/${selectedOrder.tracking_code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    {selectedOrder.tracking_code}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleResendEmail(selectedOrder, "confirmation")}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Reenviar Confirmação
                </Button>
                {selectedOrder.status === "shipped" && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleResendEmail(selectedOrder, "shipped")}
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Reenviar Rastreio
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrdersTable;
