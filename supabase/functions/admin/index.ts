import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-secret',
};

interface AdminRequest {
  action: 'login' | 'get_orders' | 'get_coupons' | 'update_order' | 'create_coupon' | 'update_coupon' | 'delete_coupon' | 'toggle_coupon';
  password?: string;
  data?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const adminSecret = Deno.env.get('ADMIN_SECRET');
  
  if (!adminSecret) {
    console.error('ADMIN_SECRET not configured');
    return new Response(
      JSON.stringify({ error: 'Admin not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body: AdminRequest = await req.json();
    const providedSecret = req.headers.get('x-admin-secret');

    // Login action - validate password and return success
    if (body.action === 'login') {
      if (body.password === adminSecret) {
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        return new Response(
          JSON.stringify({ error: 'Senha incorreta' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // All other actions require valid admin secret header
    if (providedSecret !== adminSecret) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    switch (body.action) {
      case 'get_orders': {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return new Response(
          JSON.stringify({ orders: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_coupons': {
        const { data, error } = await supabase
          .from('coupons')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return new Response(
          JSON.stringify({ coupons: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update_order': {
        const { id, updates } = body.data;
        const { error } = await supabase
          .from('orders')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id);
        
        if (error) throw error;
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'create_coupon': {
        const { error } = await supabase
          .from('coupons')
          .insert([body.data]);
        
        if (error) throw error;
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update_coupon': {
        const { id, updates } = body.data;
        const { error } = await supabase
          .from('coupons')
          .update(updates)
          .eq('id', id);
        
        if (error) throw error;
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete_coupon': {
        const { id } = body.data;
        const { error } = await supabase
          .from('coupons')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'toggle_coupon': {
        const { id, active } = body.data;
        const { error } = await supabase
          .from('coupons')
          .update({ active })
          .eq('id', id);
        
        if (error) throw error;
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Admin function error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
