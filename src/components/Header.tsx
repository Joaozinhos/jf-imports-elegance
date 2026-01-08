import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, ShoppingBag, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { count: favoritesCount } = useFavorites();
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();
  const { user, loading: authLoading } = useAuth();

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

            {/* CTA, Account, Favorites & Cart */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/favoritos"
                className={`relative p-2 transition-colors duration-300 hover:opacity-70 ${
                  showScrolledStyle ? "text-foreground" : "text-primary-foreground"
                }`}
                aria-label="Favoritos"
              >
                <Heart className="w-5 h-5" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-sans rounded-full flex items-center justify-center">
                    {favoritesCount > 9 ? "9+" : favoritesCount}
                  </span>
                )}
              </Link>
              <Link
                to="/carrinho"
                className={`relative p-2 transition-colors duration-300 hover:opacity-70 ${
                  showScrolledStyle ? "text-foreground" : "text-primary-foreground"
                }`}
                aria-label="Carrinho"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-sans rounded-full flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
              
              {/* Account Button */}
              {!authLoading && (
                <Link
                  to={user ? "/minha-conta" : "/auth"}
                  className={`relative p-2 transition-colors duration-300 hover:opacity-70 ${
                    showScrolledStyle ? "text-foreground" : "text-primary-foreground"
                  }`}
                  aria-label={user ? "Minha Conta" : "Entrar"}
                >
                  <User className="w-5 h-5" />
                  {user && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
                  )}
                </Link>
              )}
              
              <Button
                variant="premium"
                size="sm"
                asChild
                className="ml-2"
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
                <Link
                  to="/favoritos"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-display text-foreground flex items-center gap-3"
                >
                  Favoritos
                  {favoritesCount > 0 && (
                    <span className="w-6 h-6 bg-red-500 text-white text-xs font-sans rounded-full flex items-center justify-center">
                      {favoritesCount}
                    </span>
                  )}
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  to="/carrinho"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-display text-foreground flex items-center gap-3"
                >
                  Carrinho
                  {cartCount > 0 && (
                    <span className="w-6 h-6 bg-foreground text-background text-xs font-sans rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <Link
                  to={user ? "/minha-conta" : "/auth"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-display text-foreground flex items-center gap-3"
                >
                  {user ? "Minha Conta" : "Entrar"}
                  {user && (
                    <span className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
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