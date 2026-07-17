"use client";

import { useFinanceStore } from "@/store/useFinanceStore";

export type FaseJornada = "diagnostico" | "reconstrucao" | "planejamento";

export interface JourneyPhase {
  fase: FaseJornada;
  temDividasEmAberto: boolean;
  reservaAlvo: number;
  reservaAtual: number;
  reservaPercentual: number;
  reservaCompleta: boolean;
  investimentosLiberados: boolean;
}

/**
 * Traduz a regra central do agente Rota Zero ("nunca recomendar investimento
 * antes de quitar dividas e montar reserva de emergencia") em estado de UI,
 * usado para liberar/bloquear o modulo de Investimentos.
 */
export function useJourneyPhase(): JourneyPhase {
  const perfil = useFinanceStore((estado) => estado.perfil);
  const dividas = useFinanceStore((estado) => estado.dividas);

  const temDividasEmAberto = dividas.some((divida) => divida.saldoDevedor > 0);

  const metaReserva = perfil.metas.find((meta) => meta.meta.toLowerCase().includes("reserva"));
  const reservaAlvo = metaReserva?.valor_necessario ?? perfil.reserva_emergencia_atual;
  const reservaAtual = perfil.reserva_emergencia_atual;
  const reservaCompleta = reservaAlvo > 0 && reservaAtual >= reservaAlvo;

  const investimentosLiberados = !temDividasEmAberto && reservaCompleta;

  let fase: FaseJornada = "diagnostico";
  if (investimentosLiberados) {
    fase = "planejamento";
  } else if (temDividasEmAberto || reservaAtual > 0) {
    fase = "reconstrucao";
  }

  return {
    fase,
    temDividasEmAberto,
    reservaAlvo,
    reservaAtual,
    reservaPercentual: reservaAlvo > 0 ? Math.min(100, Math.round((reservaAtual / reservaAlvo) * 100)) : 0,
    reservaCompleta,
    investimentosLiberados,
  };
}
