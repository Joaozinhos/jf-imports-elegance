import { motion } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  productId: string;
  size?: "sm" | "default" | "lg";
  variant?: "premium" | "premium-outline";
  className?: string;
  showIcon?: boolean;
  disabled?: boolean;
}

const AddToCartButton = ({
  productId,
  size = "default",
  variant = "premium-outline",
  className,
  showIcon = true,
  disabled = false,
}: AddToCartButtonProps) => {
  const { addToCart, isInCart } = useCart();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(productId);
  };

  const inCart = isInCart(productId);

  return (
    <Button
      variant={inCart ? "premium" : variant}
      size={size}
      onClick={handleClick}
      disabled={disabled}
      className={cn("gap-2", className)}
    >
      {showIcon && (
        <motion.div
          initial={false}
          animate={inCart ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {inCart ? (
            <Check className="w-4 h-4" />
          ) : (
            <ShoppingBag className="w-4 h-4" />
          )}
        </motion.div>
      )}
      {inCart ? "No Carrinho" : "Adicionar"}
    </Button>
  );
};

export default AddToCartButton;
