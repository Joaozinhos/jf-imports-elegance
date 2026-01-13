import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Package, Loader2, ArrowRight, Copy } from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  name: string;
  brand: string;
  quantity: number;
  price: number;
  size: string;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  items: OrderItem[];
  total_amount: number;
  shipping_amount: number;
  status: string;
  payment_method: string;
  created_at: string;
}

const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) return;

      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("order_number", orderNumber)
          .single();

        if (error) throw error;
        setOrder(data as unknown as Order);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyOrderNumber = () => {
    if (order) {
      navigator.clipboard.writeText(order.order_number);
      toast.success("Número do pedido copiado!");
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "pix":
        return "PIX";
      case "card":
        return "Cartão de Crédito";
      case "boleto":
        return "Boleto Bancário";
      default:
        return method;
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="pt-28 pb-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <section className="pt-28 pb-20">
          <div className="container mx-auto px-6 text-center">
            <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6" />
            <h1 className="text-2xl font-display text-foreground mb-4">
              Pedido não encontrado
            </h1>
            <Link to="/">
              <Button variant="premium">Voltar à Loja</Button>
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-28 pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-primary" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-display text-foreground mb-4">
              Pedido Confirmado!
            </h1>
            <p className="text-muted-foreground">
              Obrigado pela sua compra, {order.customer_name.split(" ")[0]}! 
              Enviamos os detalhes para {order.customer_email}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto bg-secondary/30 border border-divider p-6 md:p-8"
          >
            {/* Order Number */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-divider">
              <div>
                <p className="text-sm text-muted-foreground">Número do Pedido</p>
                <p className="text-xl font-display text-foreground">{order.order_number}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={copyOrderNumber} className="gap-2">
                <Copy className="w-4 h-4" />
                Copiar
              </Button>
            </div>

            {/* Order Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-divider">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Data do Pedido</p>
                <p className="text-foreground">{formatDate(order.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Forma de Pagamento</p>
                <p className="text-foreground">{getPaymentMethodLabel(order.payment_method)}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground mb-1">Endereço de Entrega</p>
                <p className="text-foreground">{order.customer_address}</p>
              </div>
            </div>

            {/* Items */}
            <div className="mb-6 pb-6 border-b border-divider">
              <p className="text-sm text-muted-foreground mb-3">Itens do Pedido</p>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <p className="text-foreground">
                        {item.brand} - {item.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.size} • Qtd: {item.quantity}
                      </p>
                    </div>
                    <p className="text-foreground font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">
                  {formatPrice(order.total_amount - order.shipping_amount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frete</span>
                <span className="text-foreground">
                  {order.shipping_amount === 0 ? "Grátis" : formatPrice(order.shipping_amount)}
                </span>
              </div>
              <div className="flex justify-between text-xl font-display pt-2 border-t border-divider">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/rastreamento">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Package className="w-4 h-4" />
                Acompanhar Pedido
              </Button>
            </Link>
            <Link to="/catalogo">
              <Button variant="premium" className="gap-2 w-full sm:w-auto">
                Continuar Comprando
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default OrderConfirmation;
