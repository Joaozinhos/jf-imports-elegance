import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-24 md:py-32 bg-card">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-xl mx-auto"
        >
          <p className="text-muted-foreground tracking-[0.3em] uppercase text-xs font-sans mb-6">
            Pronto para começar?
          </p>
          
          <h2 className="text-3xl md:text-4xl font-display text-foreground mb-6">
            Encontre Sua Fragrância
          </h2>
          
          <p className="text-muted-foreground font-sans mb-10">
            Entre em contato conosco e descubra o perfume ideal para você. 
            Atendimento personalizado via WhatsApp.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="premium" size="xl">
              Falar no WhatsApp
            </Button>
            <Button variant="premium-outline" size="xl">
              Ver Catálogo Completo
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;