import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PointsRequest {
  action: 'add_points' | 'redeem_points';
  email: string;
  order_id?: string;
  order_total?: number;
  points_to_redeem?: number;
}

// Points configuration
const POINTS_PER_REAL = 1;
const POINTS_VALUE = 0.10;
const MIN_REDEEM_POINTS = 100;

serve(async (req) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const body: PointsRequest = await req.json();
    const { action, email, order_id, order_total, points_to_redeem } = body;

    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (action === 'add_points') {
      if (!order_id || typeof order_id !== 'string') {
        return new Response(
          JSON.stringify({ success: false, error: 'order_id é obrigatório' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (typeof order_total !== 'number' || order_total <= 0) {
        return new Response(
          JSON.stringify({ success: false, error: 'order_total deve ser um número positivo' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Verify order exists
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('id')
        .eq('id', order_id)
        .single();

      if (orderError || !order) {
        return new Response(
          JSON.stringify({ success: false, error: 'Pedido não encontrado' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if points already added for this order
      const { data: existingTransaction } = await supabase
        .from('loyalty_transactions')
        .select('id')
        .eq('order_id', order_id)
        .eq('type', 'earned')
        .single();

      if (existingTransaction) {
        return new Response(
          JSON.stringify({ success: false, error: 'Pontos já adicionados para este pedido' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const earnedPoints = Math.floor(order_total * POINTS_PER_REAL);
      
      if (earnedPoints <= 0) {
        return new Response(
          JSON.stringify({ success: true, points_earned: 0, message: 'Valor insuficiente para ganhar pontos' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get existing loyalty record
      const { data: existing } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('customer_email', normalizedEmail)
        .single();

      if (existing) {
        const { error: updateError } = await supabase
          .from('loyalty_points')
          .update({
            points: existing.points + earnedPoints,
            total_earned: existing.total_earned + earnedPoints,
            updated_at: new Date().toISOString(),
          })
          .eq('customer_email', normalizedEmail);

        if (updateError) {
          console.error('Error updating points:', updateError);
          throw updateError;
        }
      } else {
        const { error: insertError } = await supabase
          .from('loyalty_points')
          .insert({
            customer_email: normalizedEmail,
            points: earnedPoints,
            total_earned: earnedPoints,
          });

        if (insertError) {
          console.error('Error inserting points:', insertError);
          throw insertError;
        }
      }

      // Record transaction
      const { error: transactionError } = await supabase
        .from('loyalty_transactions')
        .insert({
          customer_email: normalizedEmail,
          points: earnedPoints,
          type: 'earned',
          description: 'Pontos ganhos na compra',
          order_id: order_id,
        });

      if (transactionError) {
        console.error('Error recording transaction:', transactionError);
        throw transactionError;
      }

      console.log(`Added ${earnedPoints} points for ${normalizedEmail}`);

      return new Response(
        JSON.stringify({ success: true, points_earned: earnedPoints }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'redeem_points') {
      if (typeof points_to_redeem !== 'number' || points_to_redeem < MIN_REDEEM_POINTS) {
        return new Response(
          JSON.stringify({ success: false, error: `Mínimo de ${MIN_REDEEM_POINTS} pontos para resgate` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: existing } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('customer_email', normalizedEmail)
        .single();

      if (!existing || existing.points < points_to_redeem) {
        return new Response(
          JSON.stringify({ success: false, error: 'Pontos insuficientes' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const discount = points_to_redeem * POINTS_VALUE;

      const { error: updateError } = await supabase
        .from('loyalty_points')
        .update({
          points: existing.points - points_to_redeem,
          total_redeemed: existing.total_redeemed + points_to_redeem,
          updated_at: new Date().toISOString(),
        })
        .eq('customer_email', normalizedEmail);

      if (updateError) {
        console.error('Error updating points:', updateError);
        throw updateError;
      }

      const { error: transactionError } = await supabase
        .from('loyalty_transactions')
        .insert({
          customer_email: normalizedEmail,
          points: -points_to_redeem,
          type: 'redeemed',
          description: `Resgate de ${points_to_redeem} pontos = R$ ${discount.toFixed(2)} de desconto`,
        });

      if (transactionError) {
        console.error('Error recording transaction:', transactionError);
        throw transactionError;
      }

      console.log(`Redeemed ${points_to_redeem} points for ${normalizedEmail}, discount: R$ ${discount.toFixed(2)}`);

      return new Response(
        JSON.stringify({ success: true, discount, points_redeemed: points_to_redeem }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Ação inválida' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Erro interno. Tente novamente.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
