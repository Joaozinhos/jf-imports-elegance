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

  const addPoints = useCallback(async (
    email: string,
    orderTotal: number,
    orderId?: string
  ) => {
    const earnedPoints = Math.floor(orderTotal * POINTS_PER_REAL);
    if (earnedPoints <= 0) return false;

    try {
      // Check if customer already has points record
      const { data: existing } = await supabase
        .from("loyalty_points")
        .select("*")
        .eq("customer_email", email.toLowerCase())
        .single();

      if (existing) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("loyalty_points")
          .update({
            points: existing.points + earnedPoints,
            total_earned: existing.total_earned + earnedPoints,
          })
          .eq("customer_email", email.toLowerCase());

        if (updateError) throw updateError;
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from("loyalty_points")
          .insert({
            customer_email: email.toLowerCase(),
            points: earnedPoints,
            total_earned: earnedPoints,
          });

        if (insertError) throw insertError;
      }

      // Record transaction
      await supabase.from("loyalty_transactions").insert({
        customer_email: email.toLowerCase(),
        points: earnedPoints,
        type: "earned",
        description: `Pontos ganhos na compra`,
        order_id: orderId,
      });

      return true;
    } catch (err) {
      console.error("Error adding points:", err);
      return false;
    }
  }, []);

  const redeemPoints = useCallback(async (
    email: string,
    pointsToRedeem: number
  ): Promise<{ success: boolean; discount: number }> => {
    if (pointsToRedeem < MIN_REDEEM_POINTS) {
      toast.error(`Mínimo de ${MIN_REDEEM_POINTS} pontos para resgate`);
      return { success: false, discount: 0 };
    }

    try {
      const { data: existing } = await supabase
        .from("loyalty_points")
        .select("*")
        .eq("customer_email", email.toLowerCase())
        .single();

      if (!existing || existing.points < pointsToRedeem) {
        toast.error("Pontos insuficientes");
        return { success: false, discount: 0 };
      }

      const discount = pointsToRedeem * POINTS_VALUE;

      // Update points
      const { error: updateError } = await supabase
        .from("loyalty_points")
        .update({
          points: existing.points - pointsToRedeem,
          total_redeemed: existing.total_redeemed + pointsToRedeem,
        })
        .eq("customer_email", email.toLowerCase());

      if (updateError) throw updateError;

      // Record transaction
      await supabase.from("loyalty_transactions").insert({
        customer_email: email.toLowerCase(),
        points: -pointsToRedeem,
        type: "redeemed",
        description: `Resgate de ${pointsToRedeem} pontos = R$ ${discount.toFixed(2)} de desconto`,
      });

      setPoints({
        ...existing,
        points: existing.points - pointsToRedeem,
        total_redeemed: existing.total_redeemed + pointsToRedeem,
      });

      toast.success(`Você resgatou R$ ${discount.toFixed(2)} de desconto!`);
      return { success: true, discount };
    } catch (err) {
      console.error("Error redeeming points:", err);
      toast.error("Erro ao resgatar pontos");
      return { success: false, discount: 0 };
    }
  }, []);

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