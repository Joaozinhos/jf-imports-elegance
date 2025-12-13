import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";

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
        <img
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-background/90 backdrop-blur-sm px-3 py-1 text-[10px] tracking-[0.15em] uppercase font-sans text-foreground">
            {categoryLabels[product.category]}
          </span>
        </div>

        {/* Quick Action Overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="space-y-2">
        {/* Brand */}
        <p className="text-muted-foreground tracking-[0.2em] uppercase text-[10px] font-sans">
          {product.brand}
        </p>

        {/* Name */}
        <h3 className="text-base font-display text-foreground">
          {product.name}
        </h3>

        {/* Description & Size */}
        <p className="text-muted-foreground text-xs font-sans">
          {product.description} · {product.size}
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
  );
};

export default CatalogProductCard;