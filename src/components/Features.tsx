import { motion } from "framer-motion";
import { Shield, Plane, Clock, Truck } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "100% Originais",
    description: "Garantia de autenticidade em todos os produtos",
  },
  {
    icon: Plane,
    title: "Importação Segura",
    description: "Procedência verificada e documentação completa",
  },
  {
    icon: Clock,
    title: "Atendimento Rápido",
    description: "Respostas ágeis via WhatsApp",
  },
  {
    icon: Truck,
    title: "Envio Nacional",
    description: "Entregamos para todo o Brasil",
  },
];

const Features = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-muted-foreground tracking-[0.3em] uppercase text-xs font-sans mb-6">
            Por que escolher a JF Imports
          </p>
          <h2 className="text-3xl md:text-4xl font-display text-foreground">
            Nossos Diferenciais
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-foreground/10">
                <feature.icon className="w-6 h-6 text-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-display text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm font-sans">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;