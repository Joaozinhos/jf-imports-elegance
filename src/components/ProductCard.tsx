import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  name: string;
  brand: string;
  price: string;
  description: string;
  image: string;
  delay?: number;
}

const ProductCard = ({ name, brand, price, description, image, delay = 0 }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="group"
    >
      <div className="bg-secondary/50 aspect-[3/4] mb-6 overflow-hidden">
        <img
          src={image}
          alt={`${brand} ${name}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      
      <div className="text-center">
        <p className="text-muted-foreground tracking-[0.2em] uppercase text-xs font-sans mb-2">
          {brand}
        </p>
        <h3 className="text-lg font-display text-foreground mb-2">
          {name}
        </h3>
        <p className="text-muted-foreground text-sm font-sans mb-3">
          {description}
        </p>
        <p className="text-foreground font-sans font-medium text-lg mb-4">
          {price}
        </p>
        <Button variant="premium-outline" size="default">
          Solicitar via WhatsApp
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;