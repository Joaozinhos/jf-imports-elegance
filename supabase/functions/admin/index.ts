import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { create, verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AdminRequest {
  action: 'login' | 'get_orders' | 'get_coupons' | 'get_customers' | 'get_products' | 'get_stats' |
          'update_order' | 'create_coupon' | 'update_coupon' | 'delete_coupon' | 'toggle_coupon' |
          'create_product' | 'update_product' | 'delete_product' | 'toggle_product' | 'resend_order_email';
  password?: string;
  data?: any;
}

// Generate crypto key for JWT signing
async function getJwtKey(): Promise<CryptoKey> {
  const secret = Deno.env.get('ADMIN_SECRET') || '';
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret.padEnd(32, '0').slice(0, 32));
  
  return await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

// Create JWT token with 8-hour expiration
async function createAdminToken(): Promise<string> {
  const key = await getJwtKey();
  const now = Math.floor(Date.now() / 1000);
  
  const jwt = await create(
    { alg: "HS256", typ: "JWT" },
    {
      role: "admin",
      iat: now,
      exp: now + (8 * 60 * 60), // 8 hours
    },
    key
  );
  
  return jwt;
}

// Verify JWT token
async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const key = await getJwtKey();
    const payload = await verify(token, key);
    
    // Check if token has admin role and is not expired
    if (payload.role !== "admin") {
      return false;
    }
    
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp === "number" && payload.exp < now) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
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

    // Login action - validate password and return JWT token
    if (body.action === 'login') {
      if (body.password === adminSecret) {
        const token = await createAdminToken();
        return new Response(
          JSON.stringify({ success: true, token }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        return new Response(
          JSON.stringify({ error: 'Senha incorreta' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // All other actions require valid JWT token in Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.substring(7);
    const isValidToken = await verifyAdminToken(token);
    
    if (!isValidToken) {
      return new Response(
        JSON.stringify({ error: 'Sessão inválida ou expirada. Faça login novamente.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    switch (body.action) {
      case 'get_stats': {
        const { period } = body.data || { period: '30d' };
        
        // Calculate date range
        const now = new Date();
        let startDate: Date;
        switch (period) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case '7d':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case '30d':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'this_month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'last_month':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            break;
          default:
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        // Get orders in period
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .order('created_at', { ascending: true });

        if (ordersError) throw ordersError;

        // Calculate stats
        const totalOrders = orders?.length || 0;
        const completedOrders = orders?.filter(o => o.status === 'delivered').length || 0;
        const cancelledOrders = orders?.filter(o => o.status === 'cancelled').length || 0;
        const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
        const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;
        const averageTicket = completedOrders > 0 ? totalRevenue / completedOrders : 0;

        // Get unique customers in period
        const uniqueEmails = new Set(orders?.map(o => o.customer_email));
        const newCustomers = uniqueEmails.size;

        // Group orders by date for charts
        const ordersByDate: Record<string, { date: string; orders: number; revenue: number }> = {};
        orders?.forEach(order => {
          const date = order.created_at.split('T')[0];
          if (!ordersByDate[date]) {
            ordersByDate[date] = { date, orders: 0, revenue: 0 };
          }
          ordersByDate[date].orders++;
          ordersByDate[date].revenue += Number(order.total_amount);
        });

        const chartData = Object.values(ordersByDate).sort((a, b) => a.date.localeCompare(b.date));

        return new Response(
          JSON.stringify({
            stats: {
              totalOrders,
              completedOrders,
              cancelledOrders,
              pendingOrders,
              totalRevenue,
              averageTicket,
              newCustomers,
            },
            chartData,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_orders': {
        const { status, startDate, endDate, sortBy, sortOrder } = body.data || {};
        
        let query = supabase.from('orders').select('*');
        
        if (status && status !== 'all') {
          query = query.eq('status', status);
        }
        if (startDate) {
          query = query.gte('created_at', startDate);
        }
        if (endDate) {
          query = query.lte('created_at', endDate + 'T23:59:59');
        }
        
        query = query.order(sortBy || 'created_at', { ascending: sortOrder === 'asc' });
        
        const { data, error } = await query;
        
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

      case 'get_customers': {
        // Aggregate customer stats directly from orders table (service role bypasses RLS)
        const { data: orders, error } = await supabase
          .from('orders')
          .select('customer_email, customer_name, customer_phone, total_amount, created_at');
        
        if (error) throw error;
        
        // Aggregate in application code
        const customerMap = new Map<string, {
          customer_email: string;
          customer_name: string;
          customer_phone: string | null;
          total_orders: number;
          total_spent: number;
          first_order_date: string;
          last_order_date: string;
        }>();
        
        orders?.forEach(order => {
          const email = order.customer_email;
          if (!customerMap.has(email)) {
            customerMap.set(email, {
              customer_email: email,
              customer_name: order.customer_name,
              customer_phone: order.customer_phone,
              total_orders: 0,
              total_spent: 0,
              first_order_date: order.created_at,
              last_order_date: order.created_at
            });
          }
          const stats = customerMap.get(email)!;
          stats.total_orders++;
          stats.total_spent += Number(order.total_amount);
          if (order.created_at > stats.last_order_date) {
            stats.last_order_date = order.created_at;
          }
          if (order.created_at < stats.first_order_date) {
            stats.first_order_date = order.created_at;
          }
        });
        
        // Sort by total spent descending
        const customers = Array.from(customerMap.values())
          .sort((a, b) => b.total_spent - a.total_spent);
        
        return new Response(
          JSON.stringify({ customers }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_products': {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return new Response(
          JSON.stringify({ products: data }),
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

      case 'resend_order_email': {
        const { orderId, type } = body.data;
        
        const { data: order, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();
        
        if (error) throw error;
        
        // Call send-order-email function
        const emailUrl = `${supabaseUrl}/functions/v1/send-order-email`;
        const emailRes = await fetch(emailUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({ type, order }),
        });
        
        if (!emailRes.ok) {
          throw new Error('Failed to send email');
        }
        
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

      case 'create_product': {
        const { error } = await supabase
          .from('products')
          .insert([body.data]);
        
        if (error) throw error;
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update_product': {
        const { id, updates } = body.data;
        const { error } = await supabase
          .from('products')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id);
        
        if (error) throw error;
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete_product': {
        const { id } = body.data;
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'toggle_product': {
        const { id, active } = body.data;
        const { error } = await supabase
          .from('products')
          .update({ active, updated_at: new Date().toISOString() })
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
