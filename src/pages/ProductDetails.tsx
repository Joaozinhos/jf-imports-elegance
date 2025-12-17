import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { useFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import FavoriteButton from "@/components/FavoriteButton";
import ShippingCalculator from "@/components/ShippingCalculator";
import AuthenticityBadge from "@/components/AuthenticityBadge";
import { ChevronLeft, MessageCircle, ShoppingBag, Check } from "lucide-react";

const WHATSAPP_NUMBER = "5511999999999"; // Substitua pelo número real

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product?.id || "");

  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-16 container mx-auto px-6 text-center">
          <h1 className="text-2xl font-display text-foreground mb-4">
            Produto não encontrado
          </h1>
          <Link to="/catalogo">
            <Button variant="premium-outline">Voltar ao Catálogo</Button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleWhatsAppPurchase = () => {
    const message = `Olá! Tenho interesse no perfume ${product.name} da ${product.brand} (${product.size}) - ${formatPrice(product.price)}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const categoryLabels = {
    masculino: "Masculino",
    feminino: "Feminino",
    unissex: "Unissex",
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-28 pb-16">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar ao Catálogo
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="aspect-[3/4] bg-secondary/50 overflow-hidden">
                <img
                  src={product.images[selectedImageIndex]}
                  alt={`${product.brand} ${product.name}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-24 overflow-hidden border-2 transition-colors ${
                      index === selectedImageIndex
                        ? "border-foreground"
                        : "border-transparent hover:border-muted"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - Imagem ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:py-4"
            >
              {/* Category & Brand */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground tracking-[0.2em] uppercase text-xs">
                    {product.brand}
                  </span>
                  <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                  <span className="text-muted-foreground tracking-[0.2em] uppercase text-xs">
                    {categoryLabels[product.category]}
                  </span>
                </div>
                <FavoriteButton
                  isFavorite={isFavorite(product.id)}
                  onToggle={() => toggleFavorite(product.id)}
                />
              </div>

              {/* Name */}
              <h1 className="text-3xl md:text-4xl font-display text-foreground mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <p className="text-2xl font-sans font-medium text-foreground mb-6">
                {formatPrice(product.price)}
              </p>

              {/* Description */}
              <p className="text-muted-foreground font-sans leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-8 py-6 border-y border-divider">
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
                    Tamanho
                  </p>
                  <p className="text-foreground font-sans">{product.size}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
                    Concentração
                  </p>
                  <p className="text-foreground font-sans">{product.concentration}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
                    Ano de Lançamento
                  </p>
                  <p className="text-foreground font-sans">{product.year}</p>
                </div>
              </div>

              {/* Olfactory Notes */}
              <div className="mb-10">
                <h2 className="text-lg font-display text-foreground mb-6">
                  Notas Olfativas
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      Notas de Topo
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.notes.top.map((note) => (
                        <span
                          key={note}
                          className="px-3 py-1.5 bg-secondary/50 text-foreground text-sm font-sans"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      Notas de Coração
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.notes.heart.map((note) => (
                        <span
                          key={note}
                          className="px-3 py-1.5 bg-secondary/50 text-foreground text-sm font-sans"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      Notas de Base
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.notes.base.map((note) => (
                        <span
                          key={note}
                          className="px-3 py-1.5 bg-secondary/50 text-foreground text-sm font-sans"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Authenticity Badge */}
              <AuthenticityBadge variant="full" />

              {/* CTAs */}
              <div className="flex flex-col gap-3">
                <Button
                  variant={inCart ? "premium" : "premium-outline"}
                  size="lg"
                  onClick={() => addToCart(product.id)}
                  className="w-full flex items-center justify-center gap-3"
                >
                  {inCart ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                  {inCart ? "Adicionado ao Carrinho" : "Adicionar ao Carrinho"}
                </Button>
                <Button
                  variant="premium"
                  size="lg"
                  onClick={handleWhatsAppPurchase}
                  className="w-full flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-5 h-5" />
                  Comprar via WhatsApp
                </Button>
              </div>

              {/* Shipping Calculator */}
              <div className="mt-6">
                <ShippingCalculator productValue={product.price} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ProductDetails;
