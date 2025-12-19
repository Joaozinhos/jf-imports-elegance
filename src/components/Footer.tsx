import { Instagram, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import SecurityBadges from "./SecurityBadges";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-background border-t border-divider">
      <div className="container mx-auto px-6">
        {/* Security Badges */}
        <div className="pb-8 mb-8 border-b border-divider">
          <SecurityBadges />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-display text-foreground mb-1">
              JF Imports
            </h3>
            <p className="text-muted-foreground text-sm font-sans">
              Importados Originais
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm font-sans">
            <Link
              to="/faq"
              className="text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              FAQ
            </Link>
            <Link
              to="/politica-de-trocas"
              className="text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Trocas e Devoluções
            </Link>
            <Link
              to="/politica-de-privacidade"
              className="text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Privacidade
            </Link>
            <Link
              to="/termos-de-uso"
              className="text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Termos de Uso
            </Link>
            <Link
              to="/rastreamento"
              className="text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Rastrear Pedido
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors duration-300"
              aria-label="WhatsApp"
            >
              <Phone className="w-5 h-5" strokeWidth={1.5} />
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors duration-300"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" strokeWidth={1.5} />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-muted-foreground text-xs font-sans text-center md:text-right">
            © {currentYear} JF Imports. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;