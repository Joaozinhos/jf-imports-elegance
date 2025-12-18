import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Função para validar CEP
function validateCEP(cep: string): { isValid: boolean; error?: string } {
  if (!cep || typeof cep !== 'string') {
    return { isValid: false, error: 'CEP é obrigatório' };
  }
  
  const cleanCep = cep.replace(/\D/g, "");
  
  if (cleanCep.length !== 8) {
    return { isValid: false, error: 'CEP deve ter 8 dígitos' };
  }
  
  // Verificar se CEP não é sequência de zeros
  if (cleanCep === '00000000') {
    return { isValid: false, error: 'CEP inválido' };
  }
  
  return { isValid: true };
}

// CEP origem padrão (São Paulo - pode ser configurado)
const CEP_ORIGEM = "01310100";

interface ShippingRequest {
  cepDestino: string;
  peso?: number; // em gramas
  comprimento?: number; // em cm
  altura?: number; // em cm
  largura?: number; // em cm
  valorDeclarado?: number;
}

interface ShippingOption {
  codigo: string;
  nome: string;
  valor: number;
  prazo: string;
  erro?: string;
}

async function calcularFrete(params: ShippingRequest): Promise<ShippingOption[]> {
  const {
    cepDestino,
    peso = 300, // 300g padrão para perfume
    comprimento = 16,
    altura = 8,
    largura = 8,
    valorDeclarado = 0,
  } = params;

  // Serviços: 04014 = SEDEX, 04510 = PAC
  const servicos = ["04014", "04510"];
  const results: ShippingOption[] = [];

  for (const servico of servicos) {
    try {
      // API dos Correios (calculador público) - usando HTTPS
      const url = new URL("https://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx/CalcPrecoPrazo");
      url.searchParams.set("nCdEmpresa", "");
      url.searchParams.set("sDsSenha", "");
      url.searchParams.set("sCepOrigem", CEP_ORIGEM.replace(/\D/g, ""));
      url.searchParams.set("sCepDestino", cepDestino.replace(/\D/g, ""));
      url.searchParams.set("nVlPeso", (peso / 1000).toString()); // Converter para kg
      url.searchParams.set("nCdFormato", "1"); // Caixa/Pacote
      url.searchParams.set("nVlComprimento", comprimento.toString());
      url.searchParams.set("nVlAltura", altura.toString());
      url.searchParams.set("nVlLargura", largura.toString());
      url.searchParams.set("nVlDiametro", "0");
      url.searchParams.set("sCdMaoPropria", "N");
      url.searchParams.set("nVlValorDeclarado", valorDeclarado > 0 ? valorDeclarado.toString() : "0");
      url.searchParams.set("sCdAvisoRecebimento", "N");
      url.searchParams.set("nCdServico", servico);

      console.log(`[${servico}] Calling Correios API:`, url.toString());

      // Timeout controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Accept": "application/xml, text/xml, */*",
          "User-Agent": "Mozilla/5.0 (compatible; Edge Function)",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`[${servico}] Response status:`, response.status, response.statusText);

      if (!response.ok) {
        console.error(`[${servico}] Correios API error: ${response.status} ${response.statusText}`);
        results.push({
          codigo: servico,
          nome: servico === "04014" ? "SEDEX" : "PAC",
          valor: 0,
          prazo: "",
          erro: `Erro ${response.status}: Serviço temporariamente indisponível`,
        });
        continue;
      }

      const xmlText = await response.text();
      console.log(`[${servico}] Raw XML response (first 300 chars):`, xmlText.substring(0, 300));

      // Melhor parsing do XML - buscar qualquer variação de tags
      const valorMatch = xmlText.match(/<Valor[^>]*>([^<]+)<\/Valor>/i);
      const prazoMatch = xmlText.match(/<PrazoEntrega[^>]*>([^<]+)<\/PrazoEntrega>/i);
      const erroMatch = xmlText.match(/<Erro[^>]*>([^<]+)<\/Erro>/i);
      const msgErroMatch = xmlText.match(/<MsgErro[^>]*>([^<]*)<\/MsgErro>/i);

      const erro = erroMatch?.[1]?.trim() || "0";
      const msgErro = msgErroMatch?.[1]?.trim() || "";

      console.log(`[${servico}] Parsed values - Erro: ${erro}, Msg: ${msgErro}`);

      if (erro !== "0" && msgErro) {
        console.log(`[${servico}] Service error detected: ${msgErro}`);
        results.push({
          codigo: servico,
          nome: servico === "04014" ? "SEDEX" : "PAC",
          valor: 0,
          prazo: "",
          erro: msgErro || "Serviço indisponível para esta região",
        });
        continue;
      }

      const valorStr = valorMatch?.[1]?.trim().replace(",", ".") || "0";
      const prazoStr = prazoMatch?.[1]?.trim() || "0";
      
      console.log(`[${servico}] Parsed pricing - Valor: ${valorStr}, Prazo: ${prazoStr}`);

      const valor = parseFloat(valorStr);
      const prazo = parseInt(prazoStr);

      if (valor > 0 && prazo > 0) {
        results.push({
          codigo: servico,
          nome: servico === "04014" ? "SEDEX" : "PAC",
          valor: valor,
          prazo: `${prazo} ${prazo === 1 ? "dia útil" : "dias úteis"}`,
        });
        console.log(`[${servico}] Success: R$ ${valor} in ${prazo} days`);
      } else {
        console.log(`[${servico}] Invalid values received - valor: ${valor}, prazo: ${prazo}`);
        results.push({
          codigo: servico,
          nome: servico === "04014" ? "SEDEX" : "PAC",
          valor: 0,
          prazo: "",
          erro: "Dados inválidos retornados pela API",
        });
      }

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error(`[${servico}] Request timeout`);
        results.push({
          codigo: servico,
          nome: servico === "04014" ? "SEDEX" : "PAC",
          valor: 0,
          prazo: "",
          erro: "Timeout na consulta dos Correios",
        });
      } else {
        console.error(`[${servico}] Error calculating shipping:`, error);
        results.push({
          codigo: servico,
          nome: servico === "04014" ? "SEDEX" : "PAC",
          valor: 0,
          prazo: "",
          erro: "Erro ao conectar com os Correios",
        });
      }
    }
  }

  console.log('Final Correios results:', JSON.stringify(results, null, 2));
  return results;
}

// Fallback calculation when Correios API is unavailable
function calcularFreteFallback(cepDestino: string, valorProduto: number): ShippingOption[] {
  const region = parseInt(cepDestino.charAt(0));
  const freeShipping = valorProduto >= 299;
  
  // Base prices by region
  const basePrice = region <= 3 ? 18 : region <= 6 ? 25 : 32;
  
  return [
    {
      codigo: "04510",
      nome: "PAC",
      valor: freeShipping ? 0 : basePrice,
      prazo: region <= 3 ? "5 a 8 dias úteis" : region <= 6 ? "8 a 12 dias úteis" : "10 a 15 dias úteis",
    },
    {
      codigo: "04014",
      nome: "SEDEX",
      valor: freeShipping ? 0 : Math.round(basePrice * 1.8),
      prazo: region <= 3 ? "2 a 4 dias úteis" : region <= 6 ? "3 a 6 dias úteis" : "5 a 8 dias úteis",
    },
  ];
}

serve(async (req) => {
  console.log(`[${new Date().toISOString()}] Request received: ${req.method} ${req.url}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    console.log(`Method not allowed: ${req.method}`);
    return new Response(
      JSON.stringify({ error: "Método não permitido. Use POST." }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (jsonError) {
      console.error('Invalid JSON in request body:', jsonError);
      return new Response(
        JSON.stringify({ error: "Dados inválidos. JSON malformado." }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Request body:', JSON.stringify(requestBody));

    const { cepDestino, valorProduto = 0 } = requestBody;

    // Validar CEP
    const validation = validateCEP(cepDestino);
    if (!validation.isValid) {
      console.log(`CEP validation failed: ${validation.error}`);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cleanCep = cepDestino.replace(/\D/g, "");
    console.log(`Processing shipping calculation for CEP: ${cleanCep}, product value: R$ ${valorProduto}`);

    // Try Correios API first
    let options = await calcularFrete({
      cepDestino: cleanCep,
      valorDeclarado: valorProduto,
    });

    console.log('Correios API results:', JSON.stringify(options, null, 2));

    // Check if we got valid results
    const validOptions = options.filter(opt => opt.valor > 0 && !opt.erro);
    
    if (validOptions.length === 0) {
      console.log("No valid options from Correios API, using fallback calculation");
      options = calcularFreteFallback(cleanCep, valorProduto);
    } else {
      console.log(`Got ${validOptions.length} valid options from Correios API`);
      // Apply free shipping for orders above R$ 299
      if (valorProduto >= 299) {
        console.log('Applying free shipping for orders above R$ 299');
        options = options.map(opt => ({ ...opt, valor: 0 }));
      }
    }

    // Sort by price (PAC first, usually cheaper)
    options.sort((a, b) => a.valor - b.valor);

    const response = { 
      options,
      freeShippingThreshold: 299,
      cep: cleanCep,
      success: true
    };

    console.log('Final response:', JSON.stringify(response, null, 2));

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error in calculate-shipping function:', error);
    
    let errorMessage = "Erro interno do servidor";
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Categorizar tipos de erro
      if (error.message.includes('fetch')) {
        errorMessage = "Erro ao conectar com os Correios. Tente novamente.";
        statusCode = 503;
      } else if (error.message.includes('timeout')) {
        errorMessage = "Timeout na consulta. Tente novamente.";
        statusCode = 504;
      }
    }
    
    console.error(`Returning error response: ${statusCode} - ${errorMessage}`);

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        success: false,
        timestamp: new Date().toISOString()
      }),
      { status: statusCode, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
