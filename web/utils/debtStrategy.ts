import type { Divida } from "@/store/useFinanceStore";

export type EstrategiaQuitacao = "bola_de_neve" | "avalanche";

export interface DividaQuitada {
  id: string;
  credor: string;
  mesQuitado: number;
}

export interface PontoLinhaDoTempo {
  mes: number;
  saldoTotal: number;
}

export interface ResultadoQuitacao {
  meses: number;
  totalJurosPago: number;
  ordemQuitacao: DividaQuitada[];
  linhaDoTempo: PontoLinhaDoTempo[];
  estourouLimite: boolean;
}

export interface ComparativoEstrategias {
  bolaDeNeve: ResultadoQuitacao;
  avalanche: ResultadoQuitacao;
  economiaJurosAvalanche: number;
  mesesGanhosAvalanche: number;
}

const LIMITE_MESES_SIMULACAO = 600;
const TOLERANCIA_CENTAVOS = 0.005;

export function ordenarPorEstrategia(dividas: Divida[], estrategia: EstrategiaQuitacao): Divida[] {
  const copia = [...dividas];
  return estrategia === "bola_de_neve"
    ? copia.sort((a, b) => a.saldoDevedor - b.saldoDevedor)
    : copia.sort((a, b) => b.taxaJurosMensal - a.taxaJurosMensal);
}

/**
 * Simula a quitacao mes a mes: paga o minimo de cada divida ativa, e todo
 * orcamento livre (aporte extra + parcelas de dividas ja quitadas, o efeito
 * "bola de neve") vai para a divida prioritaria da estrategia escolhida.
 */
export function simularQuitacaoDividas(
  dividasIniciais: Divida[],
  aporteExtraMensal: number,
  estrategia: EstrategiaQuitacao,
): ResultadoQuitacao {
  const dividasAtivas = dividasIniciais.filter((d) => d.saldoDevedor > 0).map((d) => ({ ...d }));
  const saldoInicial = dividasAtivas.reduce((soma, d) => soma + d.saldoDevedor, 0);

  if (dividasAtivas.length === 0) {
    return {
      meses: 0,
      totalJurosPago: 0,
      ordemQuitacao: [],
      linhaDoTempo: [{ mes: 0, saldoTotal: 0 }],
      estourouLimite: false,
    };
  }

  let mes = 0;
  let totalJurosPago = 0;
  const ordemQuitacao: DividaQuitada[] = [];
  const linhaDoTempo: PontoLinhaDoTempo[] = [{ mes: 0, saldoTotal: saldoInicial }];
  let estourouLimite = false;

  while (dividasAtivas.some((d) => d.saldoDevedor > 0)) {
    mes += 1;
    if (mes > LIMITE_MESES_SIMULACAO) {
      estourouLimite = true;
      break;
    }

    for (const divida of dividasAtivas) {
      if (divida.saldoDevedor <= 0) continue;
      const juros = divida.saldoDevedor * divida.taxaJurosMensal;
      divida.saldoDevedor += juros;
      totalJurosPago += juros;
    }

    let orcamentoLivre = aporteExtraMensal;
    for (const divida of dividasAtivas) {
      if (divida.saldoDevedor <= 0) orcamentoLivre += divida.valorParcela;
    }

    for (const divida of dividasAtivas) {
      if (divida.saldoDevedor <= 0) continue;
      divida.saldoDevedor -= Math.min(divida.valorParcela, divida.saldoDevedor);
    }

    const prioridades = ordenarPorEstrategia(
      dividasAtivas.filter((d) => d.saldoDevedor > 0),
      estrategia,
    );
    for (const divida of prioridades) {
      if (orcamentoLivre <= 0) break;
      const pagamento = Math.min(orcamentoLivre, divida.saldoDevedor);
      divida.saldoDevedor -= pagamento;
      orcamentoLivre -= pagamento;
    }

    for (const divida of dividasAtivas) {
      const jaRegistrada = ordemQuitacao.some((o) => o.id === divida.id);
      if (divida.saldoDevedor <= TOLERANCIA_CENTAVOS && !jaRegistrada) {
        divida.saldoDevedor = 0;
        ordemQuitacao.push({ id: divida.id, credor: divida.credor, mesQuitado: mes });
      }
    }

    linhaDoTempo.push({
      mes,
      saldoTotal: Math.round(dividasAtivas.reduce((soma, d) => soma + Math.max(0, d.saldoDevedor), 0) * 100) / 100,
    });
  }

  return {
    meses: mes,
    totalJurosPago: Math.round(totalJurosPago * 100) / 100,
    ordemQuitacao,
    linhaDoTempo,
    estourouLimite,
  };
}

export function compararEstrategias(dividas: Divida[], aporteExtraMensal: number): ComparativoEstrategias {
  const bolaDeNeve = simularQuitacaoDividas(dividas, aporteExtraMensal, "bola_de_neve");
  const avalanche = simularQuitacaoDividas(dividas, aporteExtraMensal, "avalanche");

  return {
    bolaDeNeve,
    avalanche,
    economiaJurosAvalanche: Math.round((bolaDeNeve.totalJurosPago - avalanche.totalJurosPago) * 100) / 100,
    mesesGanhosAvalanche: bolaDeNeve.meses - avalanche.meses,
  };
}
