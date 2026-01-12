import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LoyaltyPoints {
  id: string;
  customer_email: string;
  points: number;
  total_earned: number;
  total_redeemed: number;
}

interface LoyaltyTransaction {
  id: string;
  customer_email: string;
  points: number;
  type: "earned" | "redeemed" | "expired";
  description: string;
  created_at: string;
}

// Points configuration
const POINTS_PER_REAL = 1; // 1 point per R$ spent
const POINTS_VALUE = 0.10; // Each point = R$ 0.10 discount
const MIN_REDEEM_POINTS = 100; // Minimum points to redeem

export const useLoyaltyPoints = () => {
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState<LoyaltyPoints | null>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);

  const fetchPoints = useCallback(async (email: string) => {
    if (!email) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("loyalty_points")
        .select("*")
        .eq("customer_email", email.toLowerCase())
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching points:", error);
        return null;
      }

      setPoints(data);
      return data;
    } catch (err) {
      console.error("Error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async (email: string) => {
    if (!email) return [];
    
    try {
      const { data, error } = await supabase
        .from("loyalty_transactions")
        .select("*")
        .eq("customer_email", email.toLowerCase())
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching transactions:", error);
        return [];
      }

      setTransactions(data as LoyaltyTransaction[]);
      return data;
    } catch (err) {
      console.error("Error:", err);
      return [];
    }
  }, []);

  // Use edge function for adding points (service role access)
  const addPoints = useCallback(async (
    email: string,
    orderTotal: number,
    orderId?: string
  ) => {
    if (!orderId) {
      console.error("Order ID is required to add points");
      return false;
    }

    try {
      const { data, error } = await supabase.functions.invoke('manage-loyalty-points', {
        body: {
          action: 'add_points',
          email,
          order_id: orderId,
          order_total: orderTotal,
        },
      });

      if (error) {
        console.error("Error adding points:", error);
        return false;
      }

      if (!data?.success) {
        console.error("Failed to add points:", data?.error);
        return false;
      }

      console.log(`Added ${data.points_earned} points for ${email}`);
      return true;
    } catch (err) {
      console.error("Error adding points:", err);
      return false;
    }
  }, []);

  // Use edge function for redeeming points (service role access)
  const redeemPoints = useCallback(async (
    email: string,
    pointsToRedeem: number
  ): Promise<{ success: boolean; discount: number }> => {
    if (pointsToRedeem < MIN_REDEEM_POINTS) {
      toast.error(`Mínimo de ${MIN_REDEEM_POINTS} pontos para resgate`);
      return { success: false, discount: 0 };
    }

    try {
      const { data, error } = await supabase.functions.invoke('manage-loyalty-points', {
        body: {
          action: 'redeem_points',
          email,
          points_to_redeem: pointsToRedeem,
        },
      });

      if (error) {
        console.error("Error redeeming points:", error);
        toast.error("Erro ao resgatar pontos");
        return { success: false, discount: 0 };
      }

      if (!data?.success) {
        toast.error(data?.error || "Erro ao resgatar pontos");
        return { success: false, discount: 0 };
      }

      // Update local state
      if (points) {
        setPoints({
          ...points,
          points: points.points - pointsToRedeem,
          total_redeemed: points.total_redeemed + pointsToRedeem,
        });
      }

      toast.success(`Você resgatou R$ ${data.discount.toFixed(2)} de desconto!`);
      return { success: true, discount: data.discount };
    } catch (err) {
      console.error("Error redeeming points:", err);
      toast.error("Erro ao resgatar pontos");
      return { success: false, discount: 0 };
    }
  }, [points]);

  const calculatePointsValue = (pointsAmount: number) => {
    return pointsAmount * POINTS_VALUE;
  };

  const calculatePointsFromPurchase = (purchaseValue: number) => {
    return Math.floor(purchaseValue * POINTS_PER_REAL);
  };

  return {
    loading,
    points,
    transactions,
    fetchPoints,
    fetchTransactions,
    addPoints,
    redeemPoints,
    calculatePointsValue,
    calculatePointsFromPurchase,
    MIN_REDEEM_POINTS,
    POINTS_VALUE,
    POINTS_PER_REAL,
  };
};

export default useLoyaltyPoints;
