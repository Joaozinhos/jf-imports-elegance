import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search, RefreshCw, Eye, Mail, ShoppingBag, Crown } from "lucide-react";

interface Customer {
  customer_email: string;
  customer_name: string;
  customer_phone: string | null;
  total_orders: number;
  total_spent: number;
  last_order_date: string;
  first_order_date: string;
}

interface AdminCustomersTabProps {
  customers: Customer[];
  loading: boolean;
  onRefresh: () => void;
  formatPrice: (value: number) => string;
  formatDate: (date: string) => string;
}

const AdminCustomersTab = ({
  customers,
  loading,
  onRefresh,
  formatPrice,
  formatDate,
}: AdminCustomersTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCustomerTier = (totalSpent: number) => {
    if (totalSpent >= 5000) return { label: "VIP", color: "text-purple-neon", bg: "bg-purple-neon/10" };
    if (totalSpent >= 2000) return { label: "Gold", color: "text-yellow-500", bg: "bg-yellow-500/10" };
    if (totalSpent >= 500) return { label: "Silver", color: "text-gray-400", bg: "bg-gray-400/10" };
    return { label: "Bronze", color: "text-orange-500", bg: "bg-orange-500/10" };
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={onRefresh} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-secondary/30 border border-divider p-4">
          <p className="text-2xl font-bold text-foreground">{customers.length}</p>
          <p className="text-sm text-muted-foreground">Total de Clientes</p>
        </div>
        <div className="bg-secondary/30 border border-divider p-4">
          <p className="text-2xl font-bold text-foreground">
            {customers.filter((c) => c.total_spent >= 5000).length}
          </p>
          <p className="text-sm text-muted-foreground">Clientes VIP</p>
        </div>
        <div className="bg-secondary/30 border border-divider p-4">
          <p className="text-2xl font-bold text-foreground">
            {formatPrice(customers.reduce((sum, c) => sum + Number(c.total_spent), 0))}
          </p>
          <p className="text-sm text-muted-foreground">Total em Vendas</p>
        </div>
        <div className="bg-secondary/30 border border-divider p-4">
          <p className="text-2xl font-bold text-foreground">
            {customers.length > 0
              ? formatPrice(
                  customers.reduce((sum, c) => sum + Number(c.total_spent), 0) / customers.length
                )
              : "R$ 0,00"}
          </p>
          <p className="text-sm text-muted-foreground">Média por Cliente</p>
        </div>
      </div>

      {/* Table */}
      <div className="border border-divider overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Pedidos</TableHead>
              <TableHead>Total Gasto</TableHead>
              <TableHead>Último Pedido</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => {
              const tier = getCustomerTier(Number(customer.total_spent));
              return (
                <TableRow key={customer.customer_email}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{customer.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{customer.customer_email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs ${tier.bg} ${tier.color} rounded`}
                    >
                      <Crown className="w-3 h-3" />
                      {tier.label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1">
                      <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                      {customer.total_orders}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-primary">
                    {formatPrice(Number(customer.total_spent))}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(customer.last_order_date)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setDetailsOpen(true);
                        }}
                        title="Ver Detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          window.location.href = `mailto:${customer.customer_email}`;
                        }}
                        title="Enviar Email"
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">
        Mostrando {filteredCustomers.length} de {customers.length} clientes
      </p>

      {/* Customer Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4 py-4">
              <div className="text-center pb-4 border-b border-divider">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary">
                    {selectedCustomer.customer_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-medium">{selectedCustomer.customer_name}</h3>
                <p className="text-sm text-muted-foreground">{selectedCustomer.customer_email}</p>
                {selectedCustomer.customer_phone && (
                  <p className="text-sm text-muted-foreground">{selectedCustomer.customer_phone}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/30 border border-divider p-3 rounded">
                  <p className="text-sm text-muted-foreground">Total de Pedidos</p>
                  <p className="text-xl font-bold">{selectedCustomer.total_orders}</p>
                </div>
                <div className="bg-secondary/30 border border-divider p-3 rounded">
                  <p className="text-sm text-muted-foreground">Total Gasto</p>
                  <p className="text-xl font-bold text-primary">
                    {formatPrice(Number(selectedCustomer.total_spent))}
                  </p>
                </div>
                <div className="bg-secondary/30 border border-divider p-3 rounded">
                  <p className="text-sm text-muted-foreground">Primeiro Pedido</p>
                  <p className="text-sm font-medium">
                    {formatDate(selectedCustomer.first_order_date)}
                  </p>
                </div>
                <div className="bg-secondary/30 border border-divider p-3 rounded">
                  <p className="text-sm text-muted-foreground">Último Pedido</p>
                  <p className="text-sm font-medium">
                    {formatDate(selectedCustomer.last_order_date)}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  window.location.href = `mailto:${selectedCustomer.customer_email}`;
                }}
              >
                <Mail className="w-4 h-4 mr-2" />
                Enviar Email
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomersTab;
