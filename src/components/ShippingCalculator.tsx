import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface ShippingOption {
  nome: string;
  valor: number;
  prazo: string;
  erro?: string;
}

interface ShippingCalculatorProps {
  productValue?: number;
}

const ShippingCalculator = ({ productValue = 0 }: ShippingCalculatorProps) => {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setCep(formatted);
    setError(null);
    setShippingOptions(null);
  };

  const calculateShipping = async () => {
    const cleanCep = cep.replace(/\D/g, "");
    
    if (cleanCep.length !== 8) {
      setError("CEP inválido. Digite 8 números.");
      return;
    }

    // Validações extras de CEP
    if (cleanCep === "00000000" || /^(.)\1{7}$/.test(cleanCep)) {
      setError("CEP inválido. Verifique os números digitados.");
      return;
    }

    setLoading(true);
    setError(null);
    setShippingOptions(null);

    try {
      console.log('Calling calculate-shipping function with:', { 
        cepDestino: cleanCep, 
        valorProduto: productValue 
      });

      const { data, error: fnError } = await supabase.functions.invoke('calculate-shipping', {
        body: { 
          cepDestino: cleanCep,
          valorProduto: productValue 
        },
      });

      console.log('Function response:', { data, error: fnError });

      if (fnError) {
        console.error('Edge function error:', fnError);
        setError("Erro de comunicação. Verifique sua conexão e tente novamente.");
        return;
      }

      if (data?.error) {
        setError(data.error);
        return;
      }

      if (data?.success && data?.options) {
        // Mostrar todas as opções, incluindo as com erro para debug
        const allOptions = data.options;
        const validOptions = allOptions.filter((opt: ShippingOption) => !opt.erro);
        
        if (validOptions.length > 0) {
          setShippingOptions(validOptions);
        } else {
          // Se todas as opções têm erro, mostrar a primeira com mensagem específica
          const errorMsg = allOptions[0]?.erro || "Serviço indisponível para esta região";
          setError(errorMsg);
        }
      } else if (data?.options) {
        // Fallback para versões antigas da resposta
        const validOptions = data.options.filter((opt: ShippingOption) => !opt.erro);
        setShippingOptions(validOptions.length > 0 ? validOptions : data.options);
      } else {
        setError("Resposta inválida do serviço de frete.");
      }
    } catch (err) {
      console.error('Error calling shipping function:', err);
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (value: number) => {
    if (value === 0) return "Grátis";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="bg-secondary/30 border border-divider p-4">
      <div className="flex items-center gap-2 mb-3">
        <Truck className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-sans text-foreground">Calcular Frete</span>
      </div>

      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="00000-000"
          value={cep}
          onChange={handleCepChange}
          maxLength={9}
          className="flex-1 bg-background border-divider text-foreground placeholder:text-muted-foreground"
        />
        <Button
          variant="premium-outline"
          size="sm"
          onClick={calculateShipping}
          disabled={loading || cep.replace(/\D/g, "").length !== 8}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Calcular"}
        </Button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-destructive text-xs mt-2"
          >
            {error}
          </motion.p>
        )}

        {shippingOptions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {shippingOptions.map((option) => (
              <div
                key={option.nome}
                className="flex items-center justify-between py-2 border-b border-divider last:border-0"
              >
                <div>
                  <p className="text-sm font-sans text-foreground">{option.nome}</p>
                  <p className="text-xs text-muted-foreground">{option.prazo}</p>
                </div>
                <span className={`text-sm font-medium ${option.valor === 0 ? "text-green-600" : "text-foreground"}`}>
                  {formatPrice(option.valor)}
                </span>
              </div>
            ))}
            {productValue > 0 && productValue < 299 && (
              <p className="text-xs text-muted-foreground pt-2">
                Frete grátis em compras acima de R$ 299
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShippingCalculator;
