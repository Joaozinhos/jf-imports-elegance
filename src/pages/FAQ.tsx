import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Package, RefreshCcw, CreditCard } from "lucide-react";

const faqCategories = [
  {
    id: "autenticidade",
    title: "Autenticidade e Procedência",
    icon: HelpCircle,
    questions: [
      {
        q: "Os perfumes são originais?",
        a: "Sim, todos os nossos perfumes são 100% originais e importados diretamente das casas de fragrâncias ou distribuidores autorizados. Trabalhamos apenas com produtos autênticos, com selo de garantia e código de barras verificável.",
      },
      {
        q: "Como posso verificar a autenticidade do produto?",
        a: "Cada produto acompanha o código de barras original do fabricante, que pode ser verificado no site oficial da marca. Além disso, enviamos nota fiscal com todos os dados do produto para sua segurança.",
      },
      {
        q: "De onde vêm os produtos?",
        a: "Nossos produtos são importados legalmente de países como França, Itália, Estados Unidos e Emirados Árabes. Seguimos todas as normas da Anvisa e da Receita Federal para importação de cosméticos.",
      },
      {
        q: "Os produtos têm registro na Anvisa?",
        a: "Sim, todos os perfumes comercializados possuem registro ou notificação junto à Anvisa, garantindo que atendem às normas sanitárias brasileiras.",
      },
    ],
  },
  {
    id: "envio",
    title: "Envio e Prazos de Entrega",
    icon: Package,
    questions: [
      {
        q: "Qual o prazo de entrega?",
        a: "O prazo varia de acordo com sua região e modalidade de frete escolhida. Em média, entregas via SEDEX levam de 2 a 8 dias úteis, enquanto PAC pode levar de 5 a 15 dias úteis após a postagem.",
      },
      {
        q: "Vocês enviam para todo o Brasil?",
        a: "Sim, realizamos entregas para todos os estados brasileiros através dos Correios (PAC e SEDEX) e transportadoras parceiras.",
      },
      {
        q: "Como rastreio meu pedido?",
        a: "Após a postagem, você receberá o código de rastreamento por e-mail e WhatsApp. Você pode acompanhar sua entrega diretamente no site dos Correios ou através do nosso atendimento.",
      },
      {
        q: "Qual o valor do frete?",
        a: "O valor do frete é calculado com base no CEP de destino e peso do pedido. Oferecemos frete grátis para compras acima de R$ 299 para todo o Brasil.",
      },
      {
        q: "Os produtos são bem embalados?",
        a: "Sim, todos os produtos são cuidadosamente embalados com proteção especial para evitar danos durante o transporte. Utilizamos plástico bolha, caixas reforçadas e lacre de segurança.",
      },
    ],
  },
  {
    id: "trocas",
    title: "Trocas e Devoluções",
    icon: RefreshCcw,
    questions: [
      {
        q: "Posso trocar um produto?",
        a: "Sim, aceitamos trocas em até 7 dias corridos após o recebimento, desde que o produto esteja lacrado, na embalagem original e sem sinais de uso.",
      },
      {
        q: "E se o produto chegar danificado?",
        a: "Em caso de produtos danificados no transporte, entre em contato conosco em até 48 horas após o recebimento com fotos do produto e da embalagem. Faremos a substituição sem custo adicional.",
      },
      {
        q: "Como solicito uma devolução?",
        a: "Para solicitar devolução, entre em contato pelo WhatsApp informando o número do pedido e o motivo. Nossa equipe irá orientá-lo sobre os procedimentos e enviar a etiqueta de postagem, se aplicável.",
      },
      {
        q: "Qual o prazo para reembolso?",
        a: "Após recebermos e conferirmos o produto devolvido, o reembolso é processado em até 10 dias úteis. O prazo para o valor aparecer na sua conta depende da operadora do cartão ou banco.",
      },
    ],
  },
  {
    id: "pagamento",
    title: "Formas de Pagamento",
    icon: CreditCard,
    questions: [
      {
        q: "Quais formas de pagamento são aceitas?",
        a: "Aceitamos PIX, cartões de crédito (Visa, Mastercard, Elo, American Express), cartões de débito e boleto bancário. Parcelamos em até 12x no cartão de crédito.",
      },
      {
        q: "O pagamento é seguro?",
        a: "Sim, todas as transações são protegidas por certificado SSL e processadas por gateways de pagamento confiáveis. Não armazenamos dados de cartão em nossos servidores.",
      },
      {
        q: "Posso parcelar minha compra?",
        a: "Sim, oferecemos parcelamento em até 12x no cartão de crédito. Parcelas mínimas de R$ 50. Consulte as condições no momento da compra.",
      },
      {
        q: "Tem desconto para pagamento à vista?",
        a: "Sim, oferecemos 5% de desconto para pagamentos via PIX ou boleto bancário. O desconto é aplicado automaticamente no checkout.",
      },
    ],
  },
];

const FAQ = () => {
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
              Central de Ajuda
            </span>
            <h1 className="text-4xl md:text-5xl font-display text-foreground mt-4 mb-4">
              Perguntas Frequentes
            </h1>
            <p className="text-muted-foreground font-sans text-lg">
              Encontre respostas para as dúvidas mais comuns sobre nossos produtos e serviços.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <category.icon className="w-5 h-5 text-foreground" />
                  <h2 className="text-xl font-display text-foreground">
                    {category.title}
                  </h2>
                </div>

                <Accordion type="single" collapsible className="space-y-2">
                  {category.questions.map((item, index) => (
                    <AccordionItem
                      key={index}
                      value={`${category.id}-${index}`}
                      className="border border-divider bg-secondary/20 px-4"
                    >
                      <AccordionTrigger className="text-left font-sans text-foreground hover:no-underline">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground font-sans leading-relaxed">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-3xl mx-auto mt-16 text-center p-8 bg-secondary/30 border border-divider"
          >
            <h3 className="text-xl font-display text-foreground mb-3">
              Não encontrou sua resposta?
            </h3>
            <p className="text-muted-foreground mb-6">
              Nossa equipe está pronta para ajudar você pelo WhatsApp.
            </p>
            <a
              href="https://wa.me/5511999999999?text=Olá! Tenho uma dúvida sobre a JF Imports."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-sans text-sm hover:bg-foreground/90 transition-colors"
            >
              Falar com Atendimento
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default FAQ;
