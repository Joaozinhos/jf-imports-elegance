import { CreditCard } from "lucide-react";

interface InstallmentDisplayProps {
  price: number;
  maxInstallments?: number;
  className?: string;
}

const InstallmentDisplay = ({ 
  price, 
  maxInstallments = 12,
  className = "" 
}: InstallmentDisplayProps) => {
  // Parcela mínima de R$ 50
  const minInstallment = 50;
  const possibleInstallments = Math.floor(price / minInstallment);
  const installments = Math.min(possibleInstallments, maxInstallments);
  
  if (installments < 2) {
    return null;
  }
  
  const installmentValue = price / installments;
  
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className={`flex items-center gap-2 text-muted-foreground ${className}`}>
      <CreditCard className="w-4 h-4" strokeWidth={1.5} />
      <span className="text-sm font-sans">
        ou <strong className="text-foreground">{installments}x</strong> de{" "}
        <strong className="text-foreground">{formatPrice(installmentValue)}</strong>
        {" "}sem juros
      </span>
    </div>
  );
};

export default InstallmentDisplay;
