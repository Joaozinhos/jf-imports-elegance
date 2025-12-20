import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tag, X, Loader2 } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
  min_purchase: number;
}

interface CouponInputProps {
  subtotal: number;
  onApplyCoupon: (coupon: Coupon | null) => void;
  appliedCoupon: Coupon | null;
}

const CouponInput = ({ subtotal, onApplyCoupon, appliedCoupon }: CouponInputProps) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const validateCoupon = async () => {
    if (!code.trim()) {
      toast.error("Digite um código de cupom");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", code.toUpperCase().trim())
        .eq("active", true)
        .single();

      if (error || !data) {
        toast.error("Cupom inválido ou expirado");
        return;
      }

      // Check expiration
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        toast.error("Este cupom expirou");
        return;
      }

      // Check max uses
      if (data.max_uses && data.used_count >= data.max_uses) {
        toast.error("Este cupom atingiu o limite de uso");
        return;
      }

      // Check minimum purchase
      if (data.min_purchase && subtotal < data.min_purchase) {
        toast.error(`Compra mínima de R$ ${data.min_purchase} para este cupom`);
        return;
      }

      onApplyCoupon(data as Coupon);
      toast.success("Cupom aplicado com sucesso!");
      setCode("");
    } catch (err) {
      toast.error("Erro ao validar cupom");
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    onApplyCoupon(null);
    toast.info("Cupom removido");
  };

  const getDiscountText = (coupon: Coupon) => {
    switch (coupon.type) {
      case "percentage":
        return `${coupon.value}% de desconto`;
      case "fixed":
        return `R$ ${coupon.value} de desconto`;
      case "free_shipping":
        return "Frete grátis";
      default:
        return "";
    }
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between bg-primary/10 border border-primary/20 p-3 rounded">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary" />
          <div>
            <span className="text-sm font-medium text-foreground">{appliedCoupon.code}</span>
            <p className="text-xs text-primary">{getDiscountText(appliedCoupon)}</p>
          </div>
        </div>
        <button
          onClick={removeCoupon}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Remover cupom"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm text-muted-foreground">Cupom de desconto</label>
      <div className="flex gap-2">
        <Input
          placeholder="Digite seu cupom"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="flex-1 uppercase"
          onKeyDown={(e) => e.key === "Enter" && validateCoupon()}
        />
        <Button
          variant="outline"
          onClick={validateCoupon}
          disabled={loading}
          className="shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Aplicar"}
        </Button>
      </div>
    </div>
  );
};

export default CouponInput;
