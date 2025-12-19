import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// CEP origem padrão (São Paulo)
const CEP_ORIGEM = "01310100";
const FREE_SHIPPING_THRESHOLD = 299;

interface ShippingRequest {
  cepDestino: string;
  valorProduto?: number;
}

interface ShippingOption {
  codigo: string;
  nome: string;
  valor: number;
  prazo: string;
  erro?: string;
}

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

// Validar formato do CEP
function validateCEP(cep: string): { isValid: boolean; cleanCep: string; error?: string } {
  if (!cep || typeof cep !== 'string') {
    return { isValid: false, cleanCep: '', error: 'CEP é obrigatório' };
  }
  
  const cleanCep = cep.replace(/\D/g, "");
  
  if (cleanCep.length !== 8) {
    return { isValid: false, cleanCep, error: 'CEP deve ter 8 dígitos' };
  }
  
  if (cleanCep === '00000000') {
    return { isValid: false, cleanCep, error: 'CEP inválido' };
  }
  
  return { isValid: true, cleanCep };
}

// Verificar CEP real via ViaCEP API
async function verifyCepWithViaCep(cep: string): Promise<{ valid: boolean; data?: ViaCepResponse; error?: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return { valid: false, error: 'Erro ao validar CEP' };
    }
    
    const data: ViaCepResponse = await response.json();
    
    if (data.erro) {
      return { valid: false, error: 'CEP não encontrado' };
    }
    
    return { valid: true, data };
  } catch (error) {
    console.log('ViaCEP validation skipped due to timeout, proceeding with calculation');
    return { valid: true }; // Allow to proceed even if ViaCEP fails
  }
}

// Calcular frete baseado na região (fallback confiável)
function calculateShippingByRegion(cepDestino: string, valorProduto: number): ShippingOption[] {
  const region = parseInt(cepDestino.charAt(0));
  const isFreeShipping = valorProduto >= FREE_SHIPPING_THRESHOLD;
  
  // Tabela de preços por região (baseada nos primeiros dígitos do CEP)
  // Região 0-1: SP, RJ, ES - Próximo
  // Região 2-3: MG, BA, SE - Médio
  // Região 4-5: PE, AL, PB, RN, CE, PI, MA - Nordeste
  // Região 6-7: AC, AM, RR, RO, AP, PA, TO, DF, GO, MT, MS - Norte/Centro-Oeste
  // Região 8-9: PR, SC, RS - Sul
  
  let pacPrice: number;
  let sedexPrice: number;
  let pacPrazo: string;
  let sedexPrazo: string;
  
  if (region <= 1) {
    // São Paulo e RJ
    pacPrice = 18.90;
    sedexPrice = 32.90;
    pacPrazo = "5 a 8 dias úteis";
    sedexPrazo = "2 a 4 dias úteis";
  } else if (region <= 3) {
    // MG, ES e BA
    pacPrice = 22.90;
    sedexPrice = 38.90;
    pacPrazo = "6 a 10 dias úteis";
    sedexPrazo = "3 a 5 dias úteis";
  } else if (region <= 5) {
    // Nordeste
    pacPrice = 28.90;
    sedexPrice = 48.90;
    pacPrazo = "8 a 12 dias úteis";
    sedexPrazo = "4 a 6 dias úteis";
  } else if (region <= 7) {
    // Norte e Centro-Oeste
    pacPrice = 32.90;
    sedexPrice = 54.90;
    pacPrazo = "10 a 15 dias úteis";
    sedexPrazo = "5 a 8 dias úteis";
  } else {
    // Sul (8-9)
    pacPrice = 24.90;
    sedexPrice = 42.90;
    pacPrazo = "6 a 10 dias úteis";
    sedexPrazo = "3 a 5 dias úteis";
  }
  
  return [
    {
      codigo: "04510",
      nome: "PAC",
      valor: isFreeShipping ? 0 : pacPrice,
      prazo: pacPrazo,
    },
    {
      codigo: "04014",
      nome: "SEDEX",
      valor: isFreeShipping ? 0 : sedexPrice,
      prazo: sedexPrazo,
    },
  ];
}

serve(async (req) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: "Método não permitido", success: false }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body: ShippingRequest = await req.json();
    const { cepDestino, valorProduto = 0 } = body;
    
    console.log(`Processing: CEP=${cepDestino}, valor=R$${valorProduto}`);

    // Validar formato do CEP
    const validation = validateCEP(cepDestino);
    if (!validation.isValid) {
      console.log(`Invalid CEP format: ${validation.error}`);
      return new Response(
        JSON.stringify({ error: validation.error, success: false }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se o CEP existe via ViaCEP
    const viaCepResult = await verifyCepWithViaCep(validation.cleanCep);
    if (!viaCepResult.valid) {
      console.log(`ViaCEP validation failed: ${viaCepResult.error}`);
      return new Response(
        JSON.stringify({ error: viaCepResult.error || 'CEP não encontrado', success: false }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calcular frete por região
    const options = calculateShippingByRegion(validation.cleanCep, valorProduto);
    
    console.log(`Success: ${options.length} options calculated`);

    const response = { 
      options,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      cep: validation.cleanCep,
      cidade: viaCepResult.data?.localidade,
      estado: viaCepResult.data?.uf,
      success: true
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: "Erro ao calcular frete. Tente novamente.",
        success: false 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
