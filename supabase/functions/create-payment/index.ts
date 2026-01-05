import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreatePreferenceRequest {
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
    picture_url?: string;
  }>;
  payer: {
    email: string;
    name: string;
    phone?: string;
  };
  payment_method?: string;
  shipping_cost?: number;
  discount_amount?: number;
  coupon_code?: string;
  external_reference?: string;
  notification_url?: string;
}

interface MercadoPagoItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: string;
  picture_url?: string;
}

serve(async (req) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
  
  if (!accessToken) {
    console.error('MERCADO_PAGO_ACCESS_TOKEN not configured');
    return new Response(
      JSON.stringify({ error: 'Pagamento não configurado. Contate o suporte.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body: CreatePreferenceRequest = await req.json();
    console.log('Creating preference for:', JSON.stringify(body, null, 2));

    const { items, payer, shipping_cost = 0, discount_amount = 0, coupon_code, external_reference } = body;

    // Build Mercado Pago preference
    const mpItems: MercadoPagoItem[] = items.map(item => ({
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      unit_price: item.unit_price,
      currency_id: 'BRL',
      picture_url: item.picture_url,
    }));

    // Add shipping as an item if cost > 0
    if (shipping_cost > 0) {
      mpItems.push({
        id: 'shipping',
        title: 'Frete',
        quantity: 1,
        unit_price: shipping_cost,
        currency_id: 'BRL',
      });
    }

    // Apply discount if any
    if (discount_amount > 0) {
      mpItems.push({
        id: 'discount',
        title: coupon_code ? `Desconto (${coupon_code})` : 'Desconto',
        quantity: 1,
        unit_price: -discount_amount,
        currency_id: 'BRL',
      });
    }

    const siteUrl = Deno.env.get('SITE_URL') || 'https://jfimports.lovable.app';

    const preference = {
      items: mpItems,
      payer: {
        email: payer.email,
        name: payer.name,
        phone: payer.phone ? { number: payer.phone } : undefined,
      },
      back_urls: {
        success: `${siteUrl}/pedido-confirmado`,
        failure: `${siteUrl}/carrinho?status=failure`,
        pending: `${siteUrl}/pedido-pendente`,
      },
      auto_return: 'approved',
      external_reference: external_reference || `order-${Date.now()}`,
      payment_methods: {
        excluded_payment_types: [],
        installments: 12,
        default_installments: 1,
      },
      statement_descriptor: 'JF IMPORTS',
    };

    console.log('Sending to Mercado Pago:', JSON.stringify(preference, null, 2));

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference),
    });

    const mpData = await mpResponse.json();
    
    if (!mpResponse.ok) {
      console.error('Mercado Pago error:', JSON.stringify(mpData));
      return new Response(
        JSON.stringify({ 
          error: 'Erro ao criar pagamento. Tente novamente.',
          details: mpData 
        }),
        { status: mpResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Preference created:', mpData.id);

    return new Response(
      JSON.stringify({
        id: mpData.id,
        init_point: mpData.init_point,
        sandbox_init_point: mpData.sandbox_init_point,
        external_reference: mpData.external_reference,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno. Tente novamente.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});