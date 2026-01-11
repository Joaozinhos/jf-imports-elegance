import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { Product } from "@/hooks/useProducts";

const CART_KEY = "jf-dluxo-cart";

export interface CartItem {
  productId: string;
  quantity: number;
}

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems([]);
      }
    }
  }, []);

  // Get products from react-query cache
  useEffect(() => {
    const cachedProducts = queryClient.getQueryData<Product[]>(["products"]);
    if (cachedProducts) {
      setProducts(cachedProducts);
    }
    
    // Subscribe to changes
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.query?.queryKey?.[0] === "products") {
        const data = queryClient.getQueryData<Product[]>(["products"]);
        if (data) {
          setProducts(data);
        }
      }
    });

    return () => unsubscribe();
  }, [queryClient]);

  const saveItems = useCallback((newItems: CartItem[]) => {
    localStorage.setItem(CART_KEY, JSON.stringify(newItems));
    setItems(newItems);
  }, []);

  const addToCart = useCallback(
    (productId: string, quantity: number = 1) => {
      const existingItem = items.find((item) => item.productId === productId);
      let newItems: CartItem[];

      if (existingItem) {
        newItems = items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...items, { productId, quantity }];
      }
      saveItems(newItems);

      const product = products.find((p) => p.id === productId);
      toast.success(`${product?.name || "Produto"} adicionado ao carrinho`, {
        action: {
          label: "Ver Carrinho",
          onClick: () => window.location.href = "/carrinho",
        },
      });
    },
    [items, saveItems, products]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      const newItems = items.filter((item) => item.productId !== productId);
      saveItems(newItems);

      const product = products.find((p) => p.id === productId);
      toast.info(`${product?.name || "Produto"} removido do carrinho`);
    },
    [items, saveItems, products]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }
      const newItems = items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      saveItems(newItems);
    },
    [items, saveItems, removeFromCart]
  );

  const clearCart = useCallback(() => {
    saveItems([]);
    toast.info("Carrinho esvaziado");
  }, [saveItems]);

  const getCartProducts = useCallback((): (Product & { quantity: number })[] => {
    return items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          return { ...product, quantity: item.quantity };
        }
        return null;
      })
      .filter((item): item is Product & { quantity: number } => item !== null);
  }, [items, products]);

  const getTotal = useCallback(() => {
    return getCartProducts().reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [getCartProducts]);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const isInCart = useCallback(
    (productId: string) => items.some((item) => item.productId === productId),
    [items]
  );

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartProducts,
    getTotal,
    getTotalItems,
    isInCart,
  };
};
