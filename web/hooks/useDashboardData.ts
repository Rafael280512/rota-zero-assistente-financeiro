"use client";

import { useMemo } from "react";

import { useFinanceStore } from "@/store/useFinanceStore";
import { calcularJurosCompostos } from "@/utils/financialMath";

export interface PontoFluxo {
  data: string;
  saldoAcumulado: number;
}

export interface FatiaGasto {
  categoria: string;
  valor: number;
}

export type SeveridadeAlerta = "atencao" | "critico";

export interface AlertaOrcamento {
  titulo: string;
  descricao: string;
  severidade: SeveridadeAlerta;
}

export interface PontoProjecao {
  ano: number;
  patrimonioProjetado: number;
  dividaProjetada: number;
}

const LIMITE_ATENCAO = 0.15;
const LIMITE_CRITICO = 0.25;
const LIMITE_JUROS_ABUSIVO = 0.05;

export function useDashboardData() {
  const perfil = useFinanceStore((s) => s.perfil);
  const transacoes = useFinanceStore((s) => s.transacoes);
  const dividas = useFinanceStore((s) => s.dividas);

  return useMemo(() => {
    const totalEntradas = transacoes.filter((t) => t.tipo === "entrada").reduce((soma, t) => soma + t.valor, 0);
    const totalSaidas = transacoes.filter((t) => t.tipo === "saida").reduce((soma, t) => soma + t.valor, 0);
    const saldoMensal = totalEntradas - totalSaidas;

    const totalDividas = dividas.reduce((soma, d) => soma + d.saldoDevedor, 0);
    const dividasEmAberto = dividas.filter((d) => d.saldoDevedor > 0);
    const patrimonioLiquido = perfil.patrimonio_total - totalDividas;

    const fluxo: PontoFluxo[] = (() => {
      const ordenadas = [...transacoes].sort((a, b) => a.data.localeCompare(b.data));
      let acumulado = 0;
      return ordenadas.map((t) => {
        acumulado += t.tipo === "entrada" ? t.valor : -t.valor;
        return { data: t.data.slice(5), saldoAcumulado: Math.round(acumulado * 100) / 100 };
      });
    })();

    const gastos: FatiaGasto[] = (() => {
      const mapa = new Map<string, number>();
      for (const t of transacoes) {
        if (t.tipo !== "saida") continue;
        mapa.set(t.categoria, (mapa.get(t.categoria) ?? 0) + t.valor);
      }
      return Array.from(mapa.entries())
        .map(([categoria, valor]) => ({ categoria, valor }))
        .sort((a, b) => b.valor - a.valor);
    })();

    const alertas: AlertaOrcamento[] = [];
    for (const fatia of gastos) {
      const percentual = perfil.renda_mensal > 0 ? fatia.valor / perfil.renda_mensal : 0;
      if (percentual >= LIMITE_CRITICO) {
        alertas.push({
          titulo: `${fatia.categoria} consumindo ${(percentual * 100).toFixed(0)}% da renda`,
          descricao: "Categoria acima do limite critico de 25% da renda mensal.",
          severidade: "critico",
        });
      } else if (percentual >= LIMITE_ATENCAO) {
        alertas.push({
          titulo: `${fatia.categoria} em ${(percentual * 100).toFixed(0)}% da renda`,
          descricao: "Vale a pena observar essa categoria nos proximos meses.",
          severidade: "atencao",
        });
      }
    }
    for (const divida of dividasEmAberto) {
      if (divida.taxaJurosMensal >= LIMITE_JUROS_ABUSIVO) {
        alertas.push({
          titulo: `${divida.credor}: juros de ${(divida.taxaJurosMensal * 100).toFixed(1)}% ao mes`,
          descricao: "Juros compostos corroendo seu patrimonio - priorize quitar essa divida.",
          severidade: "critico",
        });
      }
    }

    const projecao: PontoProjecao[] = (() => {
      const taxaInvestimentoMensal = 0.008;
      const aporteMensal = Math.max(0, saldoMensal);
      const taxaDividaMensal = dividasEmAberto.length
        ? Math.max(...dividasEmAberto.map((d) => d.taxaJurosMensal))
        : 0;

      // Compondo a taxa real do cartao (10-15% a.m.) por decadas o saldo vira
      // um numero astronomico e ilegivel - na pratica uma divida assim seria
      // renegociada, protestada ou negativada muito antes disso. Limitamos o
      // efeito da divida parada a 24 meses (o "se voce nao fizer nada"
      // realista) e deixamos so o investimento correr o horizonte inteiro.
      const MESES_MAXIMOS_DIVIDA_PARADA = 24;

      const anos = [0, 1, 2, 3, 4, 5, 7, 10];
      return anos.map((ano) => {
        const meses = ano * 12;
        const invest = calcularJurosCompostos(perfil.reserva_emergencia_atual, taxaInvestimentoMensal, meses, aporteMensal);
        const divida = calcularJurosCompostos(
          totalDividas,
          taxaDividaMensal,
          Math.min(meses, MESES_MAXIMOS_DIVIDA_PARADA),
          0,
        );
        return {
          ano,
          patrimonioProjetado: Math.round(invest.valorFinal),
          dividaProjetada: Math.round(divida.valorFinal),
        };
      });
    })();

    return {
      totalEntradas,
      totalSaidas,
      saldoMensal,
      totalDividas,
      dividasEmAberto,
      patrimonioLiquido,
      fluxo,
      gastos,
      alertas,
      projecao,
    };
  }, [perfil, transacoes, dividas]);
}
