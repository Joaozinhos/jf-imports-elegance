import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Bell, Loader2, CheckCircle } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("Email inválido");

interface StockAlertProps {
  productId: string;
  productName: string;
}

const StockAlert = ({ productId, productName }: StockAlertProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async () => {
    const validation = emailSchema.safeParse(email.trim());
    if (!validation.success) {
      toast.error("Digite um email válido");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("stock_alerts")
        .insert({
          product_id: productId,
          email: email.trim().toLowerCase(),
        });

      if (error) {
        if (error.code === "23505") {
          toast.info("Você já está inscrito para este produto");
        } else {
          throw error;
        }
      } else {
        toast.success("Você será notificado quando o produto estiver disponível!");
        setSubscribed(true);
      }
    } catch (err) {
      toast.error("Erro ao cadastrar alerta");
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className="flex items-center gap-2 p-4 bg-primary/10 border border-primary/20 rounded">
        <CheckCircle className="w-5 h-5 text-primary" />
        <span className="text-sm text-foreground">
          Você receberá um email quando {productName} estiver disponível
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-secondary/50 border border-divider rounded space-y-3">
      <div className="flex items-center gap-2">
        <Bell className="w-5 h-5 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">
          Produto indisponível
        </span>
      </div>
      <p className="text-sm text-muted-foreground">
        Deixe seu email e avisamos quando {productName} estiver disponível:
      </p>
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <Button
          variant="premium"
          onClick={handleSubmit}
          disabled={loading}
          className="shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Avisar-me"}
        </Button>
      </div>
    </div>
  );
};

export default StockAlert;
