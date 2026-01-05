import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoyaltyPoints } from "@/hooks/useLoyaltyPoints";
import { 
  Star, 
  Gift, 
  TrendingUp, 
  ShoppingBag, 
  Crown,
  Sparkles,
  ArrowRight,
  Award,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

const LoyaltyProgram = () => {
  const [email, setEmail] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const {
    loading,
    points,
    transactions,
    fetchPoints,
    fetchTransactions,
    calculatePointsValue,
    MIN_REDEEM_POINTS,
    POINTS_PER_REAL,
    POINTS_VALUE,
  } = useLoyaltyPoints();

  const handleCheckPoints = async () => {
    if (!email.trim()) return;
    setIsChecking(true);
    await fetchPoints(email);
    await fetchTransactions(email);
    setIsChecking(false);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const tiers = [
    { name: "Bronze", minPoints: 0, maxPoints: 499, color: "from-amber-700 to-amber-500", icon: Star },
    { name: "Prata", minPoints: 500, maxPoints: 1499, color: "from-gray-400 to-gray-300", icon: Award },
    { name: "Ouro", minPoints: 1500, maxPoints: 4999, color: "from-yellow-500 to-yellow-300", icon: Crown },
    { name: "Diamante", minPoints: 5000, maxPoints: Infinity, color: "from-cyan-400 to-blue-400", icon: Sparkles },
  ];

  const getCurrentTier = (totalEarned: number) => {
    return tiers.find(tier => totalEarned >= tier.minPoints && totalEarned <= tier.maxPoints) || tiers[0];
  };

  const currentTier = points ? getCurrentTier(points.total_earned) : tiers[0];
  const TierIcon = currentTier.icon;

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-primary/20 via-secondary/50 to-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        
        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6">
              <Crown className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">Programa de Fidelidade</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display text-foreground mb-6">
              Ganhe Pontos a Cada Compra
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              Acumule pontos e troque por descontos exclusivos. 
              Quanto mais você compra, mais você economiza!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/catalogo">
                <Button variant="premium" size="lg" className="gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Começar a Ganhar Pontos
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
              Como Funciona
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              É simples: compre, acumule e resgate. Sem complicação.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShoppingBag,
                title: "Compre",
                description: `Ganhe ${POINTS_PER_REAL} ponto para cada R$ 1,00 gasto em suas compras`,
                color: "bg-primary/10 text-primary",
              },
              {
                icon: TrendingUp,
                title: "Acumule",
                description: "Seus pontos não expiram e ficam disponíveis para uso a qualquer momento",
                color: "bg-green-500/10 text-green-500",
              },
              {
                icon: Gift,
                title: "Resgate",
                description: `Troque ${MIN_REDEEM_POINTS}+ pontos por R$ ${(MIN_REDEEM_POINTS * POINTS_VALUE).toFixed(2)} ou mais de desconto`,
                color: "bg-blue-500/10 text-blue-500",
              },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-background border border-divider p-8 text-center relative"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-background border border-divider w-8 h-8 flex items-center justify-center text-sm font-bold text-foreground">
                  {index + 1}
                </div>
                <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center mx-auto mb-6`}>
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-display text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
              Níveis de Fidelidade
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Quanto mais você acumula, mais benefícios você desbloqueia
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative overflow-hidden border border-divider p-6 ${
                  points && currentTier.name === tier.name ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${tier.color}`} />
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center mb-4`}>
                  <tier.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-display text-foreground mb-2">{tier.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {tier.maxPoints === Infinity 
                    ? `${tier.minPoints.toLocaleString()}+ pontos acumulados`
                    : `${tier.minPoints.toLocaleString()} - ${tier.maxPoints.toLocaleString()} pontos`
                  }
                </p>
                {points && currentTier.name === tier.name && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    Seu nível atual
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Check Points Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/30">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-background border border-divider p-8 md:p-12"
            >
              <div className="text-center mb-8">
                <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-display text-foreground mb-2">
                  Consulte Seus Pontos
                </h2>
                <p className="text-muted-foreground">
                  Digite seu email para ver seu saldo e histórico
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && handleCheckPoints()}
                />
                <Button
                  variant="premium"
                  onClick={handleCheckPoints}
                  disabled={loading || isChecking || !email.trim()}
                  className="gap-2"
                >
                  {isChecking ? "Consultando..." : "Consultar"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Points Display */}
              {points && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  {/* Current Tier & Points */}
                  <div className={`bg-gradient-to-r ${currentTier.color} p-6 rounded-lg text-white`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <TierIcon className="w-8 h-8" />
                        <span className="text-lg font-medium">Nível {currentTier.name}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-5xl font-bold mb-2">{points.points.toLocaleString()}</p>
                      <p className="text-white/80">pontos disponíveis</p>
                      <p className="text-sm mt-2 text-white/70">
                        = R$ {calculatePointsValue(points.points).toFixed(2)} em descontos
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/50 p-4 text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {points.total_earned.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Total ganho</p>
                    </div>
                    <div className="bg-secondary/50 p-4 text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {points.total_redeemed.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Total resgatado</p>
                    </div>
                  </div>

                  {/* Transaction History */}
                  {transactions.length > 0 && (
                    <div>
                      <h3 className="font-display text-foreground mb-4">Histórico Recente</h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {transactions.map((tx) => (
                          <div
                            key={tx.id}
                            className="flex items-center justify-between py-3 px-4 bg-secondary/30 border border-divider"
                          >
                            <div>
                              <p className="text-sm text-foreground">{tx.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(tx.created_at)}
                              </p>
                            </div>
                            <span
                              className={`font-medium ${
                                tx.type === "earned"
                                  ? "text-green-500"
                                  : tx.type === "redeemed"
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {tx.type === "earned" ? "+" : ""}
                              {tx.points.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {!points && email && !loading && !isChecking && (
                <div className="text-center py-8 bg-secondary/30 rounded">
                  <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nenhum ponto encontrado para este email.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Faça sua primeira compra para começar a acumular!
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
              Pronto para Começar?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Cada compra conta. Comece a acumular pontos agora e aproveite descontos exclusivos!
            </p>
            <Link to="/catalogo">
              <Button variant="premium" size="lg" className="gap-2">
                <ShoppingBag className="w-5 h-5" />
                Explorar Catálogo
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default LoyaltyProgram;