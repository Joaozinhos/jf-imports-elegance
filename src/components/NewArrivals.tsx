import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import CatalogProductCard from "./CatalogProductCard";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";

const NewArrivals = () => {
  const { data: products = [], isLoading } = useProducts();
  const newArrivals = [...products].sort((a, b) => b.year - a.year).slice(0, 4);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-primary tracking-[0.2em] uppercase text-xs font-medium">
              Novidades
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
            Lançamentos
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {newArrivals.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground px-2 py-1 text-xs tracking-wider uppercase">
                  Novo
                </div>
                <CatalogProductCard product={product} index={index} />
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/catalogo">
            <Button variant="premium" size="lg" className="gap-2">
              Explorar Catálogo
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default NewArrivals;
