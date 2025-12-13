import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Products from "@/components/Products";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Trust from "@/components/Trust";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <section id="sobre">
        <About />
      </section>
      <section id="produtos">
        <Products />
      </section>
      <section id="diferenciais">
        <Features />
      </section>
      <Testimonials />
      <Trust />
      <section id="contato">
        <CTA />
      </section>
      <Footer />
    </main>
  );
};

export default Index;
