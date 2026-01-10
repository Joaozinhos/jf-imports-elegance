import { motion } from "framer-motion";

const About = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-muted-foreground tracking-[0.3em] uppercase text-xs font-sans mb-6">
            Sobre Nós
          </p>
          
          <h2 className="text-3xl md:text-4xl font-display text-foreground mb-8">
            Excelência em Produtos Importados
          </h2>
          
          <div className="w-12 h-px bg-foreground/20 mx-auto mb-8" />
          
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg font-sans">
            A JF D'LUXO nasceu com o propósito de trazer até você produtos importados 
            selecionados com rigor e qualidade. Começamos nossa jornada com perfumes 
            das marcas mais prestigiadas do mundo, garantindo autenticidade e procedência 
            em cada frasco. Nosso compromisso é expandir continuamente nosso catálogo, 
            sempre mantendo o padrão de excelência que nos define.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;