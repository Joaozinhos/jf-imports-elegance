import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ShippingOption {
  name: string;
  price: number;
  days: string;
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

    setLoading(true);
    setError(null);

    // Simulated shipping calculation
    // In production, this would call the Correios API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulated response based on CEP region
    const region = parseInt(cleanCep.charAt(0));
    const basePrice = productValue > 299 ? 0 : 15;
    const regionMultiplier = region <= 3 ? 1 : region <= 6 ? 1.3 : 1.5;

    const options: ShippingOption[] = [
      {
        name: "PAC",
        price: basePrice > 0 ? Math.round(basePrice * regionMultiplier * 100) / 100 : 0,
        days: region <= 3 ? "5 a 8 dias úteis" : region <= 6 ? "8 a 12 dias úteis" : "10 a 15 dias úteis",
      },
      {
        name: "SEDEX",
        price: basePrice > 0 ? Math.round(basePrice * regionMultiplier * 1.8 * 100) / 100 : 0,
        days: region <= 3 ? "2 a 4 dias úteis" : region <= 6 ? "3 a 6 dias úteis" : "5 a 8 dias úteis",
      },
    ];

    setShippingOptions(options);
    setLoading(false);
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
                key={option.name}
                className="flex items-center justify-between py-2 border-b border-divider last:border-0"
              >
                <div>
                  <p className="text-sm font-sans text-foreground">{option.name}</p>
                  <p className="text-xs text-muted-foreground">{option.days}</p>
                </div>
                <span className={`text-sm font-medium ${option.price === 0 ? "text-green-600" : "text-foreground"}`}>
                  {formatPrice(option.price)}
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
