import { Shield, CheckCircle } from "lucide-react";

interface AuthenticityBadgeProps {
  variant?: "compact" | "full";
}

const AuthenticityBadge = ({ variant = "compact" }: AuthenticityBadgeProps) => {
  if (variant === "compact") {
    return (
      <div className="flex items-center gap-3 py-2">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Shield className="w-4 h-4" strokeWidth={1.5} />
          <span className="text-xs font-sans">100% Original</span>
        </div>
        <div className="w-px h-3 bg-divider" />
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
          <span className="text-xs font-sans">Importação Legal</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 py-3">
      <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 border border-divider">
        <Shield className="w-5 h-5 text-foreground" strokeWidth={1.5} />
        <div>
          <p className="text-xs font-sans text-foreground font-medium">100% Original</p>
          <p className="text-[10px] text-muted-foreground">Garantia de autenticidade</p>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 border border-divider">
        <CheckCircle className="w-5 h-5 text-foreground" strokeWidth={1.5} />
        <div>
          <p className="text-xs font-sans text-foreground font-medium">Importação Legal</p>
          <p className="text-[10px] text-muted-foreground">Anvisa e Receita Federal</p>
        </div>
      </div>
    </div>
  );
};

export default AuthenticityBadge;
