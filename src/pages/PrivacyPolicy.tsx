import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

const PrivacyPolicy = () => {
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
              <Shield className="w-6 h-6 text-foreground" />
              <span className="text-muted-foreground tracking-[0.2em] uppercase text-xs">
                LGPD
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-foreground mb-4">
              Política de Privacidade
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
            className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert"
          >
            <div className="space-y-8 text-muted-foreground font-sans leading-relaxed">
              <section>
                <h2 className="text-xl font-display text-foreground mb-4">1. Introdução</h2>
                <p>
                  A JF D'LUXO está comprometida em proteger a privacidade e os dados pessoais de seus clientes 
                  e visitantes, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
                </p>
                <p>
                  Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos 
                  suas informações pessoais.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display text-foreground mb-4">2. Dados Coletados</h2>
                <p>Coletamos os seguintes tipos de informações:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Dados de identificação:</strong> nome, CPF, e-mail, telefone</li>
                  <li><strong>Dados de endereço:</strong> CEP, logradouro, número, complemento, bairro, cidade, estado</li>
                  <li><strong>Dados de navegação:</strong> endereço IP, tipo de navegador, páginas visitadas, tempo de permanência</li>
                  <li><strong>Dados de transação:</strong> histórico de compras, preferências de produtos</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-display text-foreground mb-4">3. Finalidade do Tratamento</h2>
                <p>Utilizamos seus dados para:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Processar e entregar seus pedidos</li>
                  <li>Enviar atualizações sobre o status de compras</li>
                  <li>Oferecer suporte ao cliente</li>
                  <li>Personalizar sua experiência de compra</li>
                  <li>Enviar comunicações de marketing (com seu consentimento)</li>
                  <li>Cumprir obrigações legais e fiscais</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-display text-foreground mb-4">4. Compartilhamento de Dados</h2>
                <p>Seus dados podem ser compartilhados com:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Transportadoras:</strong> para entrega de produtos</li>
                  <li><strong>Processadores de pagamento:</strong> para efetuar transações</li>
                  <li><strong>Autoridades públicas:</strong> quando exigido por lei</li>
                </ul>
                <p className="mt-4">
                  Não vendemos, alugamos ou comercializamos seus dados pessoais com terceiros.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display text-foreground mb-4">5. Segurança dos Dados</h2>
                <p>
                  Implementamos medidas técnicas e organizacionais para proteger seus dados, incluindo:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Criptografia SSL/TLS em todas as transmissões</li>
                  <li>Armazenamento seguro em servidores protegidos</li>
                  <li>Acesso restrito a funcionários autorizados</li>
                  <li>Monitoramento contínuo de segurança</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-display text-foreground mb-4">6. Seus Direitos (LGPD)</h2>
                <p>De acordo com a LGPD, você tem direito a:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Confirmar a existência de tratamento de dados</li>
                  <li>Acessar seus dados pessoais</li>
                  <li>Corrigir dados incompletos ou desatualizados</li>
                  <li>Solicitar anonimização ou eliminação de dados desnecessários</li>
                  <li>Revogar o consentimento a qualquer momento</li>
                  <li>Solicitar portabilidade dos dados</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-display text-foreground mb-4">7. Cookies</h2>
                <p>
                  Utilizamos cookies para melhorar sua experiência de navegação. Os cookies são pequenos 
                  arquivos armazenados em seu dispositivo que nos permitem reconhecer seu navegador e 
                  lembrar certas informações.
                </p>
                <p>
                  Você pode configurar seu navegador para recusar cookies, mas isso pode afetar algumas 
                  funcionalidades do site.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display text-foreground mb-4">8. Retenção de Dados</h2>
                <p>
                  Mantemos seus dados pelo tempo necessário para cumprir as finalidades para as quais foram 
                  coletados, ou conforme exigido por lei. Dados fiscais são mantidos por 5 anos conforme 
                  legislação tributária.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display text-foreground mb-4">9. Contato</h2>
                <p>
                  Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato 
                  através do nosso WhatsApp ou e-mail de atendimento.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display text-foreground mb-4">10. Alterações</h2>
                <p>
                  Esta política pode ser atualizada periodicamente. Recomendamos que você a revise 
                  regularmente para estar ciente de quaisquer alterações.
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

export default PrivacyPolicy;
