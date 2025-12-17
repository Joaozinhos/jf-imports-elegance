import { Shield, Lock, CreditCard, Truck } from "lucide-react";

const SecurityBadges = () => {
  const badges = [
    {
      icon: Lock,
      title: "Site Seguro",
      description: "Certificado SSL",
    },
    {
      icon: CreditCard,
      title: "Pagamento Seguro",
      description: "Dados protegidos",
    },
    {
      icon: Shield,
      title: "100% Original",
      description: "Garantia de autenticidade",
    },
    {
      icon: Truck,
      title: "Envio Nacional",
      description: "Todo o Brasil",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6 md:gap-8">
      {badges.map((badge, index) => (
        <div
          key={index}
          className="flex items-center gap-2 text-muted-foreground"
        >
          <badge.icon className="w-5 h-5" strokeWidth={1.5} />
          <div className="text-left">
            <p className="text-xs font-sans text-foreground">{badge.title}</p>
            <p className="text-[10px] font-sans">{badge.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SecurityBadges;
