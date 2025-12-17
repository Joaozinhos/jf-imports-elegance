import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, RefreshCcw, Clock, CheckCircle } from "lucide-react";

const ExchangePolicy = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-28 pb-12 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="text-muted-foreground tracking-[0.2em] uppercase text-xs">
              Políticas
            </span>
            <h1 className="text-4xl md:text-5xl font-display text-foreground mt-4 mb-4">
              Trocas e Devoluções
            </h1>
            <p className="text-muted-foreground font-sans text-lg">
              Conheça nossa política completa de trocas, devoluções e garantia de autenticidade.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            {/* Guarantee Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 p-6 bg-secondary/30 border border-divider mb-12"
            >
              <Shield className="w-12 h-12 text-foreground flex-shrink-0" />
              <div>
                <h2 className="text-lg font-display text-foreground mb-1">
                  Garantia de Autenticidade
                </h2>
                <p className="text-muted-foreground font-sans text-sm">
                  Todos os produtos JF Imports são 100% originais e importados legalmente. 
                  Garantimos a procedência e autenticidade de cada item.
                </p>
              </div>
            </motion.div>

            {/* Policy Sections */}
            <div className="space-y-12">
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <RefreshCcw className="w-5 h-5 text-foreground" />
                  <h2 className="text-xl font-display text-foreground">
                    Política de Trocas
                  </h2>
                </div>
                <div className="space-y-4 text-muted-foreground font-sans leading-relaxed">
                  <p>
                    Na JF Imports, queremos que você esteja completamente satisfeito com sua compra. 
                    Caso precise realizar uma troca, seguimos as seguintes diretrizes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>
                      <strong className="text-foreground">Prazo para solicitação:</strong> 7 dias corridos a partir do recebimento do produto.
                    </li>
                    <li>
                      <strong className="text-foreground">Condições do produto:</strong> O item deve estar lacrado, na embalagem original, 
                      sem sinais de uso ou violação.
                    </li>
                    <li>
                      <strong className="text-foreground">Processo:</strong> Entre em contato pelo WhatsApp informando o número do pedido 
                      e o motivo da troca. Nossa equipe irá orientá-lo sobre os próximos passos.
                    </li>
                    <li>
                      <strong className="text-foreground">Frete de troca:</strong> Para trocas por insatisfação, o frete de envio é por 
                      conta do cliente. Em caso de defeito ou erro no envio, a JF Imports arca com os custos.
                    </li>
                  </ul>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-foreground" />
                  <h2 className="text-xl font-display text-foreground">
                    Política de Devoluções e Reembolso
                  </h2>
                </div>
                <div className="space-y-4 text-muted-foreground font-sans leading-relaxed">
                  <p>
                    De acordo com o Código de Defesa do Consumidor, você tem o direito de arrependimento 
                    em compras realizadas fora do estabelecimento comercial:
                  </p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>
                      <strong className="text-foreground">Direito de arrependimento:</strong> 7 dias corridos a partir do recebimento 
                      para desistir da compra sem justificativa.
                    </li>
                    <li>
                      <strong className="text-foreground">Condições:</strong> O produto deve ser devolvido lacrado, na embalagem original, 
                      sem sinais de uso.
                    </li>
                    <li>
                      <strong className="text-foreground">Processamento do reembolso:</strong> Após recebermos e conferirmos o produto, 
                      o reembolso é processado em até 10 dias úteis.
                    </li>
                    <li>
                      <strong className="text-foreground">Forma de reembolso:</strong> O valor será estornado na mesma forma de pagamento 
                      utilizada na compra. Para cartão de crédito, o prazo de visualização depende da operadora.
                    </li>
                  </ul>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-5 h-5 text-foreground" />
                  <h2 className="text-xl font-display text-foreground">
                    Produtos com Defeito ou Avaria
                  </h2>
                </div>
                <div className="space-y-4 text-muted-foreground font-sans leading-relaxed">
                  <p>
                    Em caso de recebimento de produto com defeito de fabricação ou danificado durante o transporte:
                  </p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>
                      <strong className="text-foreground">Prazo para comunicação:</strong> 48 horas após o recebimento.
                    </li>
                    <li>
                      <strong className="text-foreground">Documentação:</strong> Envie fotos do produto e da embalagem pelo WhatsApp, 
                      mostrando claramente o defeito ou avaria.
                    </li>
                    <li>
                      <strong className="text-foreground">Resolução:</strong> Após análise, oferecemos substituição do produto ou 
                      reembolso integral, à sua escolha.
                    </li>
                    <li>
                      <strong className="text-foreground">Frete:</strong> A JF Imports arca com todos os custos de envio em caso 
                      de defeito ou erro no pedido.
                    </li>
                  </ul>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-5 h-5 text-foreground" />
                  <h2 className="text-xl font-display text-foreground">
                    Garantia de Autenticidade
                  </h2>
                </div>
                <div className="space-y-4 text-muted-foreground font-sans leading-relaxed">
                  <p>
                    A JF Imports garante a autenticidade e originalidade de todos os produtos comercializados:
                  </p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>
                      <strong className="text-foreground">Procedência verificável:</strong> Todos os produtos possuem código de barras 
                      original que pode ser verificado junto ao fabricante.
                    </li>
                    <li>
                      <strong className="text-foreground">Importação legal:</strong> Seguimos todas as normas da Receita Federal e Anvisa 
                      para importação de cosméticos.
                    </li>
                    <li>
                      <strong className="text-foreground">Nota fiscal:</strong> Emitimos nota fiscal com descrição completa do produto 
                      para sua segurança e garantia.
                    </li>
                    <li>
                      <strong className="text-foreground">Compromisso:</strong> Caso seja comprovada a não autenticidade de qualquer produto, 
                      realizamos o reembolso integral e arcamos com todos os custos.
                    </li>
                  </ul>
                </div>
              </motion.section>
            </div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16 text-center p-8 bg-secondary/30 border border-divider"
            >
              <h3 className="text-xl font-display text-foreground mb-3">
                Precisa de Ajuda?
              </h3>
              <p className="text-muted-foreground mb-6">
                Nossa equipe está disponível para esclarecer qualquer dúvida sobre trocas e devoluções.
              </p>
              <a
                href="https://wa.me/5511999999999?text=Olá! Preciso de ajuda com uma troca ou devolução."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-sans text-sm hover:bg-foreground/90 transition-colors"
              >
                Falar pelo WhatsApp
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ExchangePolicy;
