import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { initAnalytics, analytics } from "@/lib/analytics";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import ProductDetails from "./pages/ProductDetails";
import Favorites from "./pages/Favorites";
import Cart from "./pages/Cart";
import FAQ from "./pages/FAQ";
import ExchangePolicy from "./pages/ExchangePolicy";
import OrderTracking from "./pages/OrderTracking";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import NotFound from "./pages/NotFound";
import WhatsAppButton from "./components/WhatsAppButton";
import Chatbot from "./components/Chatbot";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    initAnalytics();
    analytics.pageView(window.location.pathname);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/produto/:id" element={<ProductDetails />} />
            <Route path="/favoritos" element={<Favorites />} />
            <Route path="/carrinho" element={<Cart />} />
            
            {/* ===================================================== */}
            {/*           ROTAS ADICIONADAS AQUI                      */}
            {/* ===================================================== */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/pedido/:orderNumber" element={<OrderConfirmation />} />
            
            <Route path="/faq" element={<FAQ />} />
            <Route path="/politica-de-trocas" element={<ExchangePolicy />} />
            <Route path="/rastreamento" element={<OrderTracking />} />
            <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
            <Route path="/termos-de-uso" element={<TermsOfUse />} />
            
            {/* A rota "NotFound" deve ser sempre a última */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <WhatsAppButton />
          <Chatbot />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
