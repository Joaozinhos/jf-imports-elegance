import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const sendEmail = async (to: string[], subject: string, html: string) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "JF Imports <pedidos@resend.dev>",
      to,
      subject,
      html,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }
  
  return response.json();
};



const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  id: string;
  name: string;
  brand: string;
  quantity: number;
  price: number;
  size: string;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  items: OrderItem[];
  total_amount: number;
  shipping_amount: number;
  status: string;
  tracking_code?: string;
}

interface EmailRequest {
  type: "confirmation" | "payment_approved" | "shipped";
  order: Order;
  customer?: {
    name: string;
    email: string;
  };
}

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const getEmailContent = (type: string, order: Order) => {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">
          ${item.brand} - ${item.name} (${item.size})
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">
          ${formatPrice(item.price * item.quantity)}
        </td>
      </tr>
    `
    )
    .join("");

  const baseTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background-color: #1a1a1a; padding: 30px; text-align: center;">
          <h1 style="color: #d4af37; margin: 0; font-size: 28px; letter-spacing: 2px;">JF IMPORTS</h1>
          <p style="color: #888; margin: 10px 0 0; font-size: 12px; letter-spacing: 3px;">PERFUMES IMPORTADOS</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          {{CONTENT}}
        </div>
        
        <!-- Order Details -->
        <div style="padding: 0 30px 30px;">
          <h3 style="color: #1a1a1a; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
            Detalhes do Pedido #${order.order_number}
          </h3>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background-color: #f9f9f9;">
                <th style="padding: 12px; text-align: left; color: #666;">Produto</th>
                <th style="padding: 12px; text-align: center; color: #666;">Qtd</th>
                <th style="padding: 12px; text-align: right; color: #666;">Valor</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; text-align: right;">
            <p style="margin: 5px 0; color: #666;">
              Subtotal: ${formatPrice(order.total_amount - order.shipping_amount)}
            </p>
            <p style="margin: 5px 0; color: #666;">
              Frete: ${order.shipping_amount === 0 ? "Grátis" : formatPrice(order.shipping_amount)}
            </p>
            <p style="margin: 10px 0 0; font-size: 20px; font-weight: bold; color: #1a1a1a;">
              Total: ${formatPrice(order.total_amount)}
            </p>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background-color: #f9f9f9;">
            <h4 style="margin: 0 0 10px; color: #1a1a1a;">Endereço de Entrega</h4>
            <p style="margin: 0; color: #666; line-height: 1.6;">
              ${order.customer_address}
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #1a1a1a; padding: 30px; text-align: center;">
          <p style="color: #888; margin: 0 0 10px; font-size: 14px;">
            Dúvidas? Entre em contato conosco
          </p>
          <p style="color: #d4af37; margin: 0; font-size: 14px;">
            suporte@jfimports.com.br | (11) 99999-9999
          </p>
          <p style="color: #666; margin: 20px 0 0; font-size: 12px;">
            © ${new Date().getFullYear()} JF Imports. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  let content = "";
  let subject = "";

  switch (type) {
    case "confirmation":
      subject = `Pedido Confirmado #${order.order_number} - JF Imports`;
      content = `
        <h2 style="color: #1a1a1a; margin: 0 0 20px;">Pedido Confirmado! ✓</h2>
        <p style="color: #666; line-height: 1.8; margin: 0 0 20px;">
          Olá <strong>${order.customer_name}</strong>,
        </p>
        <p style="color: #666; line-height: 1.8; margin: 0 0 20px;">
          Recebemos seu pedido e estamos aguardando a confirmação do pagamento. 
          Assim que o pagamento for aprovado, você receberá um novo email.
        </p>
        <div style="background-color: #d4af37; color: #1a1a1a; padding: 15px 20px; text-align: center; margin: 20px 0;">
          <strong>Número do Pedido: ${order.order_number}</strong>
        </div>
      `;
      break;

    case "payment_approved":
      subject = `Pagamento Aprovado #${order.order_number} - JF Imports`;
      content = `
        <h2 style="color: #1a1a1a; margin: 0 0 20px;">Pagamento Aprovado! 💳</h2>
        <p style="color: #666; line-height: 1.8; margin: 0 0 20px;">
          Olá <strong>${order.customer_name}</strong>,
        </p>
        <p style="color: #666; line-height: 1.8; margin: 0 0 20px;">
          Ótima notícia! Seu pagamento foi aprovado e já estamos preparando seu pedido 
          para envio. Você receberá o código de rastreio assim que ele for postado.
        </p>
        <div style="background-color: #22c55e; color: #ffffff; padding: 15px 20px; text-align: center; margin: 20px 0;">
          <strong>✓ Pagamento Confirmado</strong>
        </div>
      `;
      break;

    case "shipped":
      subject = `Pedido Enviado #${order.order_number} - JF Imports`;
      content = `
        <h2 style="color: #1a1a1a; margin: 0 0 20px;">Seu Pedido Foi Enviado! 📦</h2>
        <p style="color: #666; line-height: 1.8; margin: 0 0 20px;">
          Olá <strong>${order.customer_name}</strong>,
        </p>
        <p style="color: #666; line-height: 1.8; margin: 0 0 20px;">
          Seu pedido está a caminho! Use o código abaixo para acompanhar a entrega.
        </p>
        ${
          order.tracking_code
            ? `
          <div style="background-color: #3b82f6; color: #ffffff; padding: 15px 20px; text-align: center; margin: 20px 0;">
            <p style="margin: 0 0 5px; font-size: 12px;">Código de Rastreio</p>
            <strong style="font-size: 18px; letter-spacing: 2px;">${order.tracking_code}</strong>
          </div>
          <p style="text-align: center;">
            <a href="https://www.correios.com.br/rastreamento" 
               style="color: #d4af37; text-decoration: none;">
              Rastrear no site dos Correios →
            </a>
          </p>
        `
            : ""
        }
      `;
      break;

    default:
      throw new Error(`Unknown email type: ${type}`);
  }

  return {
    subject,
    html: baseTemplate.replace("{{CONTENT}}", content),
  };
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Send order email function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, order, customer }: EmailRequest = await req.json();

    console.log(`Sending ${type} email for order ${order.order_number}`);

    const { subject, html } = getEmailContent(type, order);

    const emailResponse = await sendEmail([order.customer_email], subject, html);

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
