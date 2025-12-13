import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  product: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Marina Silva",
    location: "São Paulo, SP",
    rating: 5,
    text: "Produto original, entrega super rápida e atendimento impecável. Já é minha terceira compra na JF Imports!",
    product: "La Vie Est Belle - Lancôme",
  },
  {
    id: "2",
    name: "Ricardo Almeida",
    location: "Rio de Janeiro, RJ",
    rating: 5,
    text: "Finalmente encontrei uma loja confiável para comprar perfumes importados. Preço justo e qualidade garantida.",
    product: "Sauvage - Dior",
  },
  {
    id: "3",
    name: "Fernanda Costa",
    location: "Belo Horizonte, MG",
    rating: 5,
    text: "O perfume chegou muito bem embalado e lacrado. Atenção aos detalhes que faz toda a diferença!",
    product: "Good Girl - Carolina Herrera",
  },
  {
    id: "4",
    name: "Carlos Eduardo",
    location: "Curitiba, PR",
    rating: 5,
    text: "Excelente experiência de compra. O suporte pelo WhatsApp é muito atencioso e esclarece todas as dúvidas.",
    product: "Bleu de Chanel",
  },
  {
    id: "5",
    name: "Ana Beatriz",
    location: "Brasília, DF",
    rating: 5,
    text: "Comprei para presentear e foi um sucesso! Produto autêntico e chegou antes do prazo.",
    product: "Black Opium - YSL",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 6000);
    return () => clearInterval(interval);
  }, []);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-20 md:py-28 bg-card">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-muted-foreground tracking-[0.3em] uppercase text-xs font-sans mb-4">
            Depoimentos
          </p>
          <h2 className="text-3xl md:text-4xl font-display text-foreground">
            O Que Dizem Nossos Clientes
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="max-w-3xl mx-auto">
          <div className="relative min-h-[280px] flex items-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-foreground text-foreground" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg md:text-xl font-sans text-foreground leading-relaxed mb-6">
                  "{current.text}"
                </blockquote>

                {/* Product */}
                <p className="text-muted-foreground text-sm font-sans mb-4">
                  {current.product}
                </p>

                {/* Author */}
                <div>
                  <p className="font-display text-foreground">{current.name}</p>
                  <p className="text-muted-foreground text-xs tracking-wider uppercase">
                    {current.location}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={prevTestimonial}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Depoimento anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-foreground" : "bg-muted"
                  }`}
                  aria-label={`Ir para depoimento ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Próximo depoimento"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
