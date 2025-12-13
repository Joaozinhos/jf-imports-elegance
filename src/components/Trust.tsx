import { motion } from "framer-motion";

const Trust = () => {
  return (
    <section className="py-20 md:py-28 bg-foreground">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="w-12 h-px bg-primary-foreground/30 mx-auto mb-10" />
          
          <p className="text-2xl md:text-3xl lg:text-4xl font-display text-primary-foreground italic leading-relaxed">
            "Qualidade e procedência garantidas em cada produto que entregamos."
          </p>
          
          <div className="w-12 h-px bg-primary-foreground/30 mx-auto mt-10 mb-8" />
          
          <p className="text-primary-foreground/60 tracking-[0.3em] uppercase text-xs font-sans">
            JF Imports — Compromisso com Excelência
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Trust;