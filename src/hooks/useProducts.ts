import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: "masculino" | "feminino" | "unissex";
  description: string;
  size: string;
  image: string;
  images: string[];
  notes: ProductNotes;
  concentration: string;
  year: number;
  stock: number;
  active: boolean;
}

const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("name");

  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }

  return (data || []).map((product) => ({
    id: product.id,
    name: product.name,
    brand: product.brand,
    price: Number(product.price),
    category: product.category as "masculino" | "feminino" | "unissex",
    description: product.description || "",
    size: product.size,
    image: product.image,
    images: Array.isArray(product.images) ? product.images as string[] : [],
    notes: (product.notes as unknown as ProductNotes) || { top: [], heart: [], base: [] },
    concentration: product.concentration || "",
    year: product.year || 0,
    stock: product.stock,
    active: product.active,
  }));
};

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useProduct = (id: string) => {
  const { data: products, isLoading, error } = useProducts();
  const product = products?.find((p) => p.id === id);
  return { product, isLoading, error };
};

// Derived data
export const useBrands = () => {
  const { data: products } = useProducts();
  const brands = products ? [...new Set(products.map((p) => p.brand))].sort() : [];
  return brands;
};
