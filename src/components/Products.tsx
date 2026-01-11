import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Loader2 } from "lucide-react";

const Products = () => {
  const { data: products = [], isLoading } = useProducts();
  const featuredProducts = products.slice(0, 3);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section className="py-24 md:py-32 bg-card">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-muted-foreground tracking-[0.3em] uppercase text-xs font-sans mb-6">
            Coleção
          </p>
          <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
            Perfumes em Destaque
          </h2>
          <p className="text-muted-foreground font-sans max-w-md mx-auto">
            Fragrâncias selecionadas das melhores marcas internacionais.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {featuredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                name={product.name}
                brand={product.brand}
                price={formatPrice(product.price)}
                description={`${product.concentration} ${product.size}`}
                image={product.image}
                delay={index * 0.15}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
