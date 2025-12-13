import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

const products = [
  {
    name: "Sauvage",
    brand: "Dior",
    price: "R$ 699,00",
    description: "Eau de Parfum 100ml",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=800&fit=crop",
  },
  {
    name: "Bleu de Chanel",
    brand: "Chanel",
    price: "R$ 789,00",
    description: "Eau de Parfum 100ml",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=800&fit=crop",
  },
  {
    name: "La Vie Est Belle",
    brand: "Lancôme",
    price: "R$ 549,00",
    description: "Eau de Parfum 75ml",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=800&fit=crop",
  },
];

const Products = () => {
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {products.map((product, index) => (
            <ProductCard
              key={product.name}
              {...product}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;