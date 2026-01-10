import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  customer_cep: string;
  customer_address: string;
  total_amount: number;
  shipping_amount: number;
  shipping_method: string;
  items: any; // JSON data from database
  status: string;
  payment_method: string;
  tracking_code: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

const OrderTracking = () => {
  const [accessToken, setAccessToken] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statusInfo = {
    pending: { label: "Aguardando Pagamento", color: "warning", icon: Clock },
    paid: { label: "Pagamento Confirmado", color: "success", icon: CheckCircle },
    processing: { label: "Em Separação", color: "info", icon: Package },
    shipped: { label: "Enviado", color: "info", icon: Truck },
    delivered: { label: "Entregue", color: "success", icon: CheckCircle },
    cancelled: { label: "Cancelado", color: "destructive", icon: Clock },
  };

  const searchOrder = async () => {
    if (!accessToken.trim()) {
      setError("Digite o código de acesso do pedido");
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      // Query using access_token for secure order lookup
      const { data, error: queryError } = await supabase
        .from("orders")
        .select("*")
        .eq("access_token", accessToken.trim())
        .single();

      if (queryError) {
        if (queryError.code === 'PGRST116') {
          setError("Nenhum pedido encontrado. Verifique o código de acesso e tente novamente.");
        } else {
          console.error("Error fetching order:", queryError);
          setError("Erro ao consultar pedido. Tente novamente.");
        }
        return;
      }

      if (!data) {
        setError("Nenhum pedido encontrado. Verifique o código de acesso e tente novamente.");
        return;
      }

      // Parse items JSON
      const parsedOrder = {
        ...data,
        items: typeof data.items === 'string' 
          ? JSON.parse(data.items) 
          : Array.isArray(data.items) 
            ? data.items 
            : []
      };
      setOrder(parsedOrder);
    } catch (err) {
      console.error("Search error:", err);
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchOrder();
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif text-foreground mb-4">
              Rastreamento de Pedidos
            </h1>
            <p className="text-muted-foreground">
              Digite o código de acesso enviado no email de confirmação do pedido
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Consultar Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex gap-4">
                <Input
                  type="text"
                  placeholder="Código de acesso (enviado no email de confirmação)"
                  value={accessToken}
                  onChange={(e) => {
                    setAccessToken(e.target.value);
                    setError(null);
                  }}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={loading}
                  variant="premium"
                >
                  {loading ? "Buscando..." : "Buscar"}
                </Button>
              </form>
              {error && (
                <p className="text-destructive text-sm mt-2">{error}</p>
              )}
            </CardContent>
          </Card>

          {/* Order Details */}
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Status Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Pedido {order.order_number}</CardTitle>
                    <Badge 
                      variant={statusInfo[order.status as keyof typeof statusInfo]?.color as "default" | "secondary" | "destructive" | "outline"}
                    >
                      {statusInfo[order.status as keyof typeof statusInfo]?.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Dados do Cliente</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{order.customer_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{order.customer_email}</span>
                        </div>
                        {order.customer_phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{order.customer_phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>CEP: {order.customer_cep}</span>
                        </div>
                        {order.customer_address && (
                          <div className="text-muted-foreground">
                            {order.customer_address}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Informações do Pedido</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Data:</span> {formatDate(order.created_at)}
                        </div>
                        <div>
                          <span className="font-medium">Forma de Pagamento:</span> {order.payment_method || "WhatsApp"}
                        </div>
                        <div>
                          <span className="font-medium">Envio:</span> {order.shipping_method || "A definir"}
                        </div>
                        {order.tracking_code && (
                          <div>
                            <span className="font-medium">Código de Rastreio:</span> {order.tracking_code}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Total:</span> {formatPrice(order.total_amount)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <h5 className="font-medium mb-1">Observações:</h5>
                      <p className="text-sm text-muted-foreground">{order.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Items Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Itens do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-3 border-b border-divider last:border-0">
                        <div>
                          <h5 className="font-medium">{item.name}</h5>
                          <p className="text-sm text-muted-foreground">
                            Quantidade: {item.quantity}x
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(item.price)} cada
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t border-divider">
                      <div className="flex justify-between mb-2">
                        <span>Subtotal:</span>
                        <span>{formatPrice(order.total_amount - order.shipping_amount)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Frete:</span>
                        <span>{order.shipping_amount > 0 ? formatPrice(order.shipping_amount) : "Grátis"}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>{formatPrice(order.total_amount)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* WhatsApp Contact */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h4 className="font-medium mb-2">Dúvidas sobre seu pedido?</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Entre em contato conosco pelo WhatsApp para mais informações
                    </p>
                    <Button
                      variant="premium"
                      onClick={() => {
                        const message = `Olá! Gostaria de mais informações sobre meu pedido ${order.order_number}`;
                        window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                    >
                      Falar no WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderTracking;