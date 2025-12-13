import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // On non-home pages, always use scrolled style
  const showScrolledStyle = isScrolled || !isHomePage;

  const navItems = [
    { label: "Sobre", href: isHomePage ? "#sobre" : "/#sobre" },
    { label: "Catálogo", href: "/catalogo" },
    { label: "Diferenciais", href: isHomePage ? "#diferenciais" : "/#diferenciais" },
    { label: "Contato", href: isHomePage ? "#contato" : "/#contato" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          showScrolledStyle
            ? "bg-background/95 backdrop-blur-sm border-b border-divider py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="relative z-10">
              <h1
                className={`text-xl font-display transition-colors duration-300 ${
                  showScrolledStyle ? "text-foreground" : "text-primary-foreground"
                }`}
              >
                JF Imports
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                item.href.startsWith("/") && !item.href.includes("#") ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`text-xs tracking-[0.15em] uppercase font-sans transition-colors duration-300 hover:opacity-70 ${
                      showScrolledStyle ? "text-foreground" : "text-primary-foreground"
                    } ${location.pathname === item.href ? "opacity-70" : ""}`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`text-xs tracking-[0.15em] uppercase font-sans transition-colors duration-300 hover:opacity-70 ${
                      showScrolledStyle ? "text-foreground" : "text-primary-foreground"
                    }`}
                  >
                    {item.label}
                  </a>
                )
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Button
                variant="premium-outline"
                size="sm"
                asChild
                className={`transition-colors duration-300 ${
                  showScrolledStyle
                    ? "border-foreground text-foreground hover:bg-foreground hover:text-background"
                    : "border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-foreground"
                }`}
              >
                <Link to="/catalogo">Comprar</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden relative z-10 p-2 transition-colors duration-300 ${
                showScrolledStyle ? "text-foreground" : "text-primary-foreground"
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navItems.map((item, index) => (
                item.href.startsWith("/") && !item.href.includes("#") ? (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-2xl font-display text-foreground"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-display text-foreground"
                  >
                    {item.label}
                  </motion.a>
                )
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button variant="premium" size="lg" asChild onClick={() => setIsMobileMenuOpen(false)}>
                  <Link to="/catalogo">Ver Catálogo</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;