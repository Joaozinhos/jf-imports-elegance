import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";

const TermsOfUse = () => {
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
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-foreground" />
              <span className="text-muted-foreground tracking-[0.2em] uppercase text-xs">
                Legal
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-foreground mb-4">
              Termos e Condições de Uso
            </h1>
            <p className="text-muted-foreground font-sans text-lg">
              Última atualização: {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-3xl mx-auto"
          >
            <div className="space-y-8 text-muted-foreground font-sans leading-relaxed">
              <section>
                <h2 className="text-xl font-display text-foreground mb-4">1. Aceitação dos Termos</h2>
                <p>
                  Ao acessar e utilizar o site da JF Imports, você concorda integralmente com estes 
                  Termos e Condições de Uso. Se não concordar com qualquer parte destes termos, 
                  não utilize nosso site.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display text-foreground mb-4">2. Descrição do Serviço</h2>
                <p>
                  A JF Imports é uma loja virtual especializada na venda de perfumes importados 
                  originais. Comercializamos produtos autênticos de marcas internacionalmente 
                  reconhecidas.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display text-foreground mb-4">3. Cadastro e Conta</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Para realizar compras, você deve fornecer informações verdadeiras e atualizadas</li>
                  <li>Você é responsável pela confidencialidade de suas credenciais de acesso</li>
                  <li>É proibido criar contas falsas ou usar dados de terceiros</li>
                  <li>Reservamo-nos o direito de suspender contas que violem estes termos</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-display text-foreground mb-4">4. Produtos e Preços</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Todos os preços estão em Reais (BRL) e incluem impostos aplicáveis</li>
                  <li>Preços podem ser alterados sem aviso prévio</li>
                  <li>Imagens são meramente ilustrativas e podem variar da embalagem real</li>
                  <li>A disponibilidade de produtos está sujeita ao estoque</li>
                  <li>Reservamo-nos o direito de limitar quantidades por pedido</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-display text-foreground mb-4">5. Processo de Compra</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>A confirmação do pedido depende da aprovação do pagamento</li>
                  <li>Após a aprovação, você receberá confirmação por e-mail</li>
                  <li>Reservamo-nos o direito de cancelar pedidos suspeitos de fraude</li>
                  <li>O prazo de entrega começa a contar após a confirmação do pagamento</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-display text-foreground mb-4">6. Pagamento</h2>
                <p>Aceitamos as seguintes formas de pagamento:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Cartões de crédito (parcelamento em até 12x)</li>
                  <li>PIX (5% de desconto)</li>
                  <li>Boleto bancário</li>
                </ul>
                <p className="mt-4">
                  Em caso de não compensação do pagamento, o pedido será automaticamente cancelado.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display text-foreground mb-4">7. Entrega</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>As entregas são realizadas em todo o território nacional</li>
                  <li>Os prazos são estimados e podem variar conforme a região</li>
                  <li>O cliente é responsável por informar endereço correto e completo</li>
                  <li>Tentativas de entrega seguem as políticas das transportadoras</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-display text-foreground mb-4">8. Garantia e Autenticidade</h2>
                <p>
                  Garantimos que todos os produtos comercializados são 100% originais e autênticos. 
                  Cada produto acompanha código de barras verificável e nota fiscal.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display text-foreground mb-4">9. Propriedade Intelectual</h2>
                <p>
                  Todo o conteúdo do site (textos, imagens, logos, layout) é de propriedade da 
                  JF Imports ou licenciado para uso. É proibida a reprodução sem autorização prévia.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display text-foreground mb-4">10. Limitação de Responsabilidade</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Não nos responsabilizamos por danos decorrentes de mau uso dos produtos</li>
                  <li>Não garantimos que o site estará disponível ininterruptamente</li>
                  <li>Não nos responsabilizamos por atrasos causados por transportadoras</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-display text-foreground mb-4">11. Modificações dos Termos</h2>
                <p>
                  Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações 
                  entram em vigor imediatamente após sua publicação no site.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display text-foreground mb-4">12. Legislação e Foro</h2>
                <p>
                  Estes termos são regidos pela legislação brasileira. Para dirimir quaisquer 
                  controvérsias, fica eleito o foro da comarca de São Paulo, SP.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display text-foreground mb-4">13. Contato</h2>
                <p>
                  Para dúvidas sobre estes termos, entre em contato através do nosso WhatsApp 
                  ou e-mail de atendimento.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default TermsOfUse;
