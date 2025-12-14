import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { products } from "@/data/products";

const FAVORITES_KEY = "jf-imports-favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  const saveFavorites = useCallback((newFavorites: string[]) => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  }, []);

  const toggleFavorite = useCallback(
    (productId: string) => {
      const isCurrentlyFavorite = favorites.includes(productId);
      const newFavorites = isCurrentlyFavorite
        ? favorites.filter((id) => id !== productId)
        : [...favorites, productId];
      saveFavorites(newFavorites);

      const product = products.find((p) => p.id === productId);
      const productName = product ? product.name : "Produto";

      if (isCurrentlyFavorite) {
        toast.info(`${productName} removido dos favoritos`);
      } else {
        toast.success(`${productName} adicionado aos favoritos`, {
          action: {
            label: "Ver Favoritos",
            onClick: () => window.location.href = "/favoritos",
          },
        });
      }
    },
    [favorites, saveFavorites]
  );

  const isFavorite = useCallback(
    (productId: string) => favorites.includes(productId),
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    saveFavorites([]);
    toast.info("Todos os favoritos foram removidos");
  }, [saveFavorites]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    count: favorites.length,
  };
};
