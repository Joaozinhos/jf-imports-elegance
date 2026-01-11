import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import FavoriteButton from "@/components/FavoriteButton";
import AddToCartButton from "@/components/AddToCartButton";
import InstallmentDisplay from "@/components/InstallmentDisplay";
import type { Product } from "@/hooks/useProducts";

interface CatalogProductCardProps {
  product: Product;
  index: number;
}

const categoryLabels = {
  masculino: "Masculino",
  feminino: "Feminino",
  unissex: "Unissex",
};

const CatalogProductCard = ({ product, index }: CatalogProductCardProps) => {
  const { toggleFavorite, isFavorite } = useFavorites();

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.article
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

        {/* Stock Badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-4 left-4">
            <span className="bg-primary text-primary-foreground px-2 py-1 text-[10px] tracking-wider uppercase">
              Últimas unidades
            </span>
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute bottom-4 left-4">
            <span className="bg-destructive text-destructive-foreground px-2 py-1 text-[10px] tracking-wider uppercase">
              Esgotado
            </span>
          </div>
        )}

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
          <Link to={`/produto/${product.id}`} className="hover:text-muted-foreground transition-colors">
            {product.name}
          </Link>
        </h3>

        {/* Description & Size */}
        <p className="text-muted-foreground text-xs font-sans line-clamp-2">
          {product.description} · {product.size}
        </p>

        {/* Price & Installments */}
        <div className="pt-2 space-y-1">
          <p className="text-foreground font-sans font-medium">
            {formatPrice(product.price)}
          </p>
          <InstallmentDisplay price={product.price} maxInstallments={6} className="text-xs" />
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-2 pt-2">
          <AddToCartButton productId={product.id} size="sm" disabled={product.stock === 0} />
          <Link to={`/produto/${product.id}`}>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Ver
            </Button>
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default CatalogProductCard;
