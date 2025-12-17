import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
      // API dos Correios (calculador público)
      const url = new URL("http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx/CalcPrecoPrazo");
      url.searchParams.set("nCdEmpresa", "");
      url.searchParams.set("sDsSenha", "");
      url.searchParams.set("sCepOrigem", CEP_ORIGEM.replace("-", ""));
      url.searchParams.set("sCepDestino", cepDestino.replace("-", ""));
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

      console.log(`Calling Correios API for service ${servico}:`, url.toString());

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Accept": "application/xml",
        },
      });

      if (!response.ok) {
        console.error(`Correios API error for service ${servico}: ${response.status}`);
        continue;
      }

      const xmlText = await response.text();
      console.log(`Correios response for ${servico}:`, xmlText.substring(0, 500));

      // Parse XML response
      const valorMatch = xmlText.match(/<Valor>([^<]+)<\/Valor>/);
      const prazoMatch = xmlText.match(/<PrazoEntrega>([^<]+)<\/PrazoEntrega>/);
      const erroMatch = xmlText.match(/<Erro>([^<]+)<\/Erro>/);
      const msgErroMatch = xmlText.match(/<MsgErro>([^<]*)<\/MsgErro>/);

      const erro = erroMatch?.[1] || "0";
      const msgErro = msgErroMatch?.[1] || "";

      if (erro !== "0" && msgErro) {
        console.log(`Service ${servico} error: ${msgErro}`);
        results.push({
          codigo: servico,
          nome: servico === "04014" ? "SEDEX" : "PAC",
          valor: 0,
          prazo: "",
          erro: msgErro,
        });
        continue;
      }

      const valor = valorMatch?.[1]?.replace(",", ".") || "0";
      const prazo = prazoMatch?.[1] || "0";

      results.push({
        codigo: servico,
        nome: servico === "04014" ? "SEDEX" : "PAC",
        valor: parseFloat(valor),
        prazo: `${prazo} ${parseInt(prazo) === 1 ? "dia útil" : "dias úteis"}`,
      });
    } catch (error) {
      console.error(`Error calculating shipping for service ${servico}:`, error);
      results.push({
        codigo: servico,
        nome: servico === "04014" ? "SEDEX" : "PAC",
        valor: 0,
        prazo: "",
        erro: "Erro ao calcular frete",
      });
    }
  }

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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cepDestino, valorProduto = 0 } = await req.json();

    if (!cepDestino) {
      return new Response(
        JSON.stringify({ error: "CEP de destino é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cleanCep = cepDestino.replace(/\D/g, "");
    
    if (cleanCep.length !== 8) {
      return new Response(
        JSON.stringify({ error: "CEP inválido" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Calculating shipping for CEP: ${cleanCep}, product value: ${valorProduto}`);

    // Try Correios API first
    let options = await calcularFrete({
      cepDestino: cleanCep,
      valorDeclarado: valorProduto,
    });

    // Check if we got valid results
    const validOptions = options.filter(opt => opt.valor > 0 && !opt.erro);
    
    if (validOptions.length === 0) {
      console.log("Using fallback calculation");
      options = calcularFreteFallback(cleanCep, valorProduto);
    } else {
      // Apply free shipping for orders above R$ 299
      if (valorProduto >= 299) {
        options = options.map(opt => ({ ...opt, valor: 0 }));
      }
    }

    // Sort by price (PAC first, usually cheaper)
    options.sort((a, b) => a.valor - b.valor);

    return new Response(
      JSON.stringify({ 
        options,
        freeShippingThreshold: 299,
        cep: cleanCep,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error in calculate-shipping function:', error);
    const errorMessage = error instanceof Error ? error.message : "Erro ao calcular frete";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
