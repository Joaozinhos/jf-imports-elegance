import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: "sm" | "md";
  className?: string;
}

const FavoriteButton = ({
  isFavorite,
  onToggle,
  size = "md",
  className,
}: FavoriteButtonProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        "flex items-center justify-center rounded-full bg-background/90 backdrop-blur-sm transition-colors hover:bg-background",
        sizeClasses[size],
        className
      )}
      aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <motion.div
        initial={false}
        animate={isFavorite ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={cn(
            iconSizes[size],
            "transition-colors",
            isFavorite
              ? "fill-red-500 text-red-500"
              : "fill-transparent text-foreground"
          )}
        />
      </motion.div>
    </motion.button>
  );
};

export default FavoriteButton;
