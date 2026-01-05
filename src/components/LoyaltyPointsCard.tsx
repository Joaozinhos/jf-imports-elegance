import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Gift, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoyaltyPoints } from "@/hooks/useLoyaltyPoints";

interface LoyaltyPointsCardProps {
  email: string;
  onApplyDiscount?: (discount: number) => void;
  subtotal?: number;
}

const LoyaltyPointsCard = ({ email, onApplyDiscount, subtotal = 0 }: LoyaltyPointsCardProps) => {
  const {
    loading,
    points,
    transactions,
    fetchPoints,
    fetchTransactions,
    redeemPoints,
    calculatePointsValue,
    calculatePointsFromPurchase,
    MIN_REDEEM_POINTS,
  } = useLoyaltyPoints();

  const [showHistory, setShowHistory] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState("");
  const [hasAppliedDiscount, setHasAppliedDiscount] = useState(false);

  useEffect(() => {
    if (email) {
      fetchPoints(email);
      fetchTransactions(email);
    }
  }, [email, fetchPoints, fetchTransactions]);

  const handleRedeem = async () => {
    const amount = parseInt(redeemAmount);
    if (isNaN(amount) || amount <= 0) return;

    const maxRedeemable = Math.floor(subtotal / 0.10); // Max points based on subtotal
    const pointsToRedeem = Math.min(amount, points?.points || 0, maxRedeemable);

    const result = await redeemPoints(email, pointsToRedeem);
    if (result.success && onApplyDiscount) {
      onApplyDiscount(result.discount);
      setHasAppliedDiscount(true);
      setRedeemAmount("");
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const potentialPoints = calculatePointsFromPurchase(subtotal);

  if (!email) {
    return (
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-4 rounded">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-5 h-5 text-primary" />
          <span className="font-medium text-foreground">Programa de Fidelidade</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Informe seu email para verificar seus pontos e ganhar recompensas.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-secondary/30 border border-divider p-4 animate-pulse">
        <div className="h-6 bg-secondary rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-secondary rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-4 rounded"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          <span className="font-medium text-foreground">Programa de Fidelidade</span>
        </div>
        {points && (
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">{points.points}</span>
            <span className="text-sm text-muted-foreground ml-1">pontos</span>
          </div>
        )}
      </div>

      {points && points.points >= MIN_REDEEM_POINTS && !hasAppliedDiscount && (
        <div className="mb-4 p-3 bg-background/50 rounded">
          <p className="text-sm text-muted-foreground mb-2">
            Resgate seus pontos por desconto (R$ 0,10 por ponto)
          </p>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Qtd de pontos"
              value={redeemAmount}
              onChange={(e) => setRedeemAmount(e.target.value)}
              min={MIN_REDEEM_POINTS}
              max={Math.min(points.points, Math.floor(subtotal / 0.10))}
              className="flex-1"
            />
            <Button
              variant="premium"
              size="sm"
              onClick={handleRedeem}
              disabled={
                !redeemAmount ||
                parseInt(redeemAmount) < MIN_REDEEM_POINTS ||
                parseInt(redeemAmount) > points.points
              }
            >
              <Gift className="w-4 h-4 mr-1" />
              Resgatar
            </Button>
          </div>
          {redeemAmount && parseInt(redeemAmount) >= MIN_REDEEM_POINTS && (
            <p className="text-xs text-primary mt-2">
              = R$ {calculatePointsValue(parseInt(redeemAmount)).toFixed(2)} de desconto
            </p>
          )}
        </div>
      )}

      {hasAppliedDiscount && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded">
          <p className="text-sm text-green-600 font-medium">
            ✓ Desconto de pontos aplicado!
          </p>
        </div>
      )}

      {!points || points.points < MIN_REDEEM_POINTS ? (
        <p className="text-sm text-muted-foreground mb-3">
          {points?.points
            ? `Você precisa de mais ${MIN_REDEEM_POINTS - points.points} pontos para resgatar.`
            : "Você ainda não tem pontos. Complete uma compra para ganhar!"}
        </p>
      ) : null}

      <div className="bg-background/50 p-3 rounded mb-3">
        <p className="text-sm text-muted-foreground">
          Nesta compra você ganhará:
        </p>
        <p className="text-lg font-bold text-primary">
          +{potentialPoints} pontos
        </p>
      </div>

      {transactions.length > 0 && (
        <div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Histórico de pontos
          </button>

          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 space-y-2"
            >
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between text-sm py-1 border-b border-divider last:border-0"
                >
                  <div>
                    <span className="text-foreground">{tx.description}</span>
                    <span className="text-muted-foreground text-xs ml-2">
                      {formatDate(tx.created_at)}
                    </span>
                  </div>
                  <span
                    className={
                      tx.type === "earned"
                        ? "text-green-600"
                        : tx.type === "redeemed"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }
                  >
                    {tx.type === "earned" ? "+" : ""}{tx.points}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default LoyaltyPointsCard;