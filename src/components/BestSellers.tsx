import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import CatalogProductCard from "./CatalogProductCard";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight } from "lucide-react";

const BestSellers = () => {
  const bestSellers = products.slice(0, 4);

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-primary tracking-[0.2em] uppercase text-xs font-medium">
              Mais Vendidos
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
            Os Favoritos dos Clientes
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {bestSellers.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <CatalogProductCard product={product} index={index} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/catalogo">
            <Button variant="outline" size="lg" className="gap-2">
              Ver Todos
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BestSellers;
