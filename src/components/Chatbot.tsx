import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

const WHATSAPP_NUMBER = "5516993029890";

const quickReplies = [
  { id: 1, text: "Horário de atendimento", response: "Nosso atendimento funciona de segunda a sexta, das 9h às 18h, e aos sábados das 9h às 13h. Aos domingos e feriados estamos fechados." },
  { id: 2, text: "Prazo de entrega", response: "O prazo de entrega varia de acordo com sua região. Em média, entregas via SEDEX levam de 2 a 8 dias úteis, e PAC de 5 a 15 dias úteis após a postagem." },
  { id: 3, text: "Formas de pagamento", response: "Aceitamos PIX (5% de desconto), cartões de crédito (até 12x), cartões de débito e boleto bancário." },
  { id: 4, text: "Frete grátis", response: "Oferecemos frete grátis para compras acima de R$ 299 para todo o Brasil!" },
  { id: 5, text: "Produtos originais?", response: "Sim! Todos os nossos perfumes são 100% originais e importados. Trabalhamos apenas com produtos autênticos, com garantia de procedência." },
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Olá! 👋 Sou o assistente virtual da JF D'LUXO. Como posso ajudar você hoje?",
      isBot: true,
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const addMessage = (text: string, isBot: boolean) => {
    setMessages((prev) => [...prev, { id: Date.now(), text, isBot }]);
  };

  const handleQuickReply = (reply: typeof quickReplies[0]) => {
    addMessage(reply.text, false);
    setTimeout(() => {
      addMessage(reply.response, true);
      setTimeout(() => {
        addMessage("Posso ajudar com mais alguma coisa? Se preferir um atendimento personalizado, clique no botão abaixo para falar com nossa equipe pelo WhatsApp.", true);
      }, 500);
    }, 500);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    addMessage(inputValue, false);
    setInputValue("");

    setTimeout(() => {
      const lowerInput = inputValue.toLowerCase();
      
      // Check for keyword matches
      const matchedReply = quickReplies.find((reply) => {
        const keywords = reply.text.toLowerCase().split(" ");
        return keywords.some((keyword) => lowerInput.includes(keyword));
      });

      if (matchedReply) {
        addMessage(matchedReply.response, true);
      } else {
        addMessage(
          "Entendi sua pergunta! Para um atendimento mais completo e personalizado, recomendo falar diretamente com nossa equipe pelo WhatsApp. Eles poderão ajudá-lo da melhor forma possível.",
          true
        );
      }
    }, 800);
  };

  const handleWhatsAppRedirect = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Vim do chatbot e gostaria de um atendimento personalizado.")}`;
    window.open(url, "_blank");
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 1.5, duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-foreground hover:bg-foreground/90 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
            aria-label="Abrir chat"
          >
            <MessageSquare className="w-6 h-6 text-background" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[350px] max-w-[calc(100vw-3rem)] bg-background border border-divider shadow-2xl flex flex-col"
            style={{ height: "500px", maxHeight: "calc(100vh - 6rem)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-divider bg-secondary/30">
              <div>
                <h3 className="font-display text-foreground">JF D'LUXO</h3>
                <p className="text-xs text-muted-foreground">Assistente Virtual</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Fechar chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 text-sm font-sans ${
                      message.isBot
                        ? "bg-secondary/50 text-foreground"
                        : "bg-foreground text-background"
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}

              {/* Quick Replies */}
              {messages.length <= 2 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply.id}
                      onClick={() => handleQuickReply(reply)}
                      className="px-3 py-1.5 text-xs border border-divider text-foreground hover:bg-secondary/50 transition-colors"
                    >
                      {reply.text}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* WhatsApp CTA */}
            <div className="p-3 border-t border-divider">
              <Button
                variant="premium"
                size="sm"
                onClick={handleWhatsAppRedirect}
                className="w-full flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Atendimento Personalizado
              </Button>
            </div>

            {/* Input */}
            <div className="p-3 border-t border-divider">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <Input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 bg-secondary/30 border-divider text-sm"
                />
                <Button type="submit" variant="premium" size="icon" className="flex-shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
