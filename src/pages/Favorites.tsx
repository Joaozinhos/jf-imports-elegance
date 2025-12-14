import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { products } from "@/data/products";
import FavoriteButton from "@/components/FavoriteButton";
import { Heart, ShoppingBag } from "lucide-react";

const Favorites = () => {
  const { favorites, toggleFavorite, isFavorite, clearFavorites } = useFavorites();

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const categoryLabels = {
    masculino: "Masculino",
    feminino: "Feminino",
    unissex: "Unissex",
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
              <Heart className="w-6 h-6 text-foreground" />
              <span className="text-muted-foreground tracking-[0.2em] uppercase text-xs">
                {favorites.length} {favorites.length === 1 ? "produto" : "produtos"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-foreground mb-4">
              Meus Favoritos
            </h1>
            <p className="text-muted-foreground font-sans text-lg">
              Seus perfumes selecionados em um só lugar.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {favoriteProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Heart className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6" />
              <h2 className="text-2xl font-display text-foreground mb-4">
                Nenhum favorito ainda
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Explore nosso catálogo e salve os perfumes que mais te interessam.
              </p>
              <Link to="/catalogo">
                <Button variant="premium" size="lg" className="gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Explorar Catálogo
                </Button>
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Clear All Button */}
              <div className="flex justify-end mb-8">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFavorites}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Limpar todos
                </Button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <AnimatePresence mode="popLayout">
                  {favoriteProducts.map((product, index) => (
                    <motion.article
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="group"
                    >
                      {/* Image Container */}
                      <div className="relative bg-secondary/50 aspect-[3/4] mb-5 overflow-hidden">
                        <Link to={`/produto/${product.id}`}>
                          <img
                            src={product.image}
                            alt={`${product.brand} ${product.name}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                        </Link>

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="bg-background/90 backdrop-blur-sm px-3 py-1 text-[10px] tracking-[0.15em] uppercase font-sans text-foreground">
                            {categoryLabels[product.category]}
                          </span>
                        </div>

                        {/* Favorite Button */}
                        <div className="absolute top-4 right-4">
                          <FavoriteButton
                            isFavorite={isFavorite(product.id)}
                            onToggle={() => toggleFavorite(product.id)}
                            size="sm"
                          />
                        </div>

                        {/* Quick Action Overlay */}
                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300 pointer-events-none" />
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        {/* Brand */}
                        <p className="text-muted-foreground tracking-[0.2em] uppercase text-[10px] font-sans">
                          {product.brand}
                        </p>

                        {/* Name */}
                        <h3 className="text-base font-display text-foreground">
                          <Link
                            to={`/produto/${product.id}`}
                            className="hover:text-muted-foreground transition-colors"
                          >
                            {product.name}
                          </Link>
                        </h3>

                        {/* Description & Size */}
                        <p className="text-muted-foreground text-xs font-sans">
                          {product.description.slice(0, 60)}... · {product.size}
                        </p>

                        {/* Price & CTA */}
                        <div className="flex items-center justify-between pt-2">
                          <p className="text-foreground font-sans font-medium">
                            {formatPrice(product.price)}
                          </p>
                          <Link to={`/produto/${product.id}`}>
                            <Button variant="premium-outline" size="sm">
                              Ver Mais
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Favorites;
