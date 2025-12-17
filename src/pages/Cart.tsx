import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import ShippingCalculator from "@/components/ShippingCalculator";
import { ShoppingBag, Trash2, Plus, Minus, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "5511999999999"; // Substitua pelo número real

const Cart = () => {
  const {
    getCartProducts,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotal,
    getTotalItems,
  } = useCart();

  const cartProducts = getCartProducts();
  const total = getTotal();
  const totalItems = getTotalItems();

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleWhatsAppCheckout = () => {
    const itemsList = cartProducts
      .map(
        (item) =>
          `• ${item.name} (${item.brand}) - ${item.size} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`
      )
      .join("\n");

    const message = `Olá! Gostaria de finalizar meu pedido:\n\n${itemsList}\n\n*Total: ${formatPrice(total)}*\n\nAguardo informações sobre pagamento e entrega.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-28 pb-12 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <ShoppingBag className="w-6 h-6 text-foreground" />
              <span className="text-muted-foreground tracking-[0.2em] uppercase text-xs">
                {totalItems} {totalItems === 1 ? "item" : "itens"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-foreground mb-4">
              Meu Carrinho
            </h1>
            <p className="text-muted-foreground font-sans text-lg">
              Revise seus itens antes de finalizar a compra.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {cartProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6" />
              <h2 className="text-2xl font-display text-foreground mb-4">
                Seu carrinho está vazio
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Explore nosso catálogo e adicione os perfumes que deseja.
              </p>
              <Link to="/catalogo">
                <Button variant="premium" size="lg" className="gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Explorar Catálogo
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display text-foreground">
                    Produtos
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Limpar carrinho
                  </Button>
                </div>

                <AnimatePresence mode="popLayout">
                  {cartProducts.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex gap-4 md:gap-6 p-4 bg-secondary/30 border border-divider"
                    >
                      {/* Image */}
                      <Link to={`/produto/${item.id}`} className="flex-shrink-0">
                        <div className="w-24 h-32 md:w-28 md:h-36 bg-secondary/50 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>

                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <p className="text-muted-foreground tracking-[0.15em] uppercase text-[10px] font-sans">
                            {item.brand}
                          </p>
                          <Link to={`/produto/${item.id}`}>
                            <h3 className="text-base font-display text-foreground hover:text-muted-foreground transition-colors">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-muted-foreground text-xs font-sans mt-1">
                            {item.size}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center border border-divider hover:bg-secondary transition-colors"
                              aria-label="Diminuir quantidade"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-sans text-foreground">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center border border-divider hover:bg-secondary transition-colors"
                              aria-label="Aumentar quantidade"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price & Remove */}
                          <div className="flex items-center gap-4">
                            <p className="text-foreground font-sans font-medium">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-muted-foreground hover:text-red-500 transition-colors"
                              aria-label="Remover item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-28 bg-secondary/30 border border-divider p-6">
                  <h2 className="text-xl font-display text-foreground mb-6">
                    Resumo do Pedido
                  </h2>

                  <div className="space-y-3 mb-6">
                    {cartProducts.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.name} x{item.quantity}
                        </span>
                        <span className="text-foreground">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-divider pt-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-foreground font-sans font-medium">
                        Subtotal
                      </span>
                      <span className="text-foreground font-sans font-medium text-xl">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  {/* Shipping Calculator */}
                  <div className="mb-6">
                    <ShippingCalculator productValue={total} />
                  </div>

                  <Button
                    variant="premium"
                    size="lg"
                    onClick={handleWhatsAppCheckout}
                    className="w-full flex items-center justify-center gap-3"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Finalizar via WhatsApp
                  </Button>

                  <p className="text-muted-foreground text-xs text-center mt-4">
                    Você será redirecionado para o WhatsApp para combinar pagamento e entrega.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Cart;
