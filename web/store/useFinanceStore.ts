"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import perfilSeed from "@/data/perfil_investidor.json";
import produtosSeed from "@/data/produtos_financeiros.json";
import transacoesSeed from "@/data/transacoes.json";
import dividasSeed from "@/data/dividas.json";

export interface Meta {
  meta: string;
  valor_necessario: number;
  prazo: string;
}

export interface Perfil {
  nome: string;
  idade: number;
  profissao: string;
  renda_mensal: number;
  perfil_investidor: string;
  objetivo_principal: string;
  patrimonio_total: number;
  reserva_emergencia_atual: number;
  aceita_risco: boolean;
  metas: Meta[];
}

export interface Produto {
  nome: string;
  categoria: string;
  risco: string;
  rentabilidade: string;
  aporte_minimo: number;
  indicado_para: string;
}

export interface Transacao {
  id: string;
  data: string;
  descricao: string;
  categoria: string;
  valor: number;
  tipo: "entrada" | "saida";
}

export type CategoriaDivida = "cartao_credito" | "financiamento_veiculo" | "emprestimo_pessoal" | string;

export interface Divida {
  id: string;
  credor: string;
  categoria: CategoriaDivida;
  valorOriginal: number;
  saldoDevedor: number;
  taxaJurosMensal: number;
  parcelasRestantes: number;
  valorParcela: number;
}

interface FinanceState {
  perfil: Perfil;
  produtos: Produto[];
  transacoes: Transacao[];
  dividas: Divida[];
  conteudosLidos: string[];

  adicionarTransacao: (transacao: Omit<Transacao, "id">) => void;
  atualizarTransacao: (id: string, dados: Partial<Omit<Transacao, "id">>) => void;
  removerTransacao: (id: string) => void;

  registrarPagamentoDivida: (id: string, valorPago: number) => void;
  atualizarDivida: (id: string, dados: Partial<Omit<Divida, "id">>) => void;

  marcarConteudoLido: (id: string, lido: boolean) => void;

  restaurarDadosDeExemplo: () => void;
}

function gerarId(prefixo: string): string {
  return `${prefixo}-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

const estadoInicial = {
  perfil: perfilSeed as Perfil,
  produtos: produtosSeed as Produto[],
  transacoes: transacoesSeed as Transacao[],
  dividas: dividasSeed as Divida[],
  conteudosLidos: [] as string[],
};

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      ...estadoInicial,

      adicionarTransacao: (transacao) =>
        set((estado) => ({
          transacoes: [...estado.transacoes, { ...transacao, id: gerarId("t") }],
        })),

      atualizarTransacao: (id, dados) =>
        set((estado) => ({
          transacoes: estado.transacoes.map((t) => (t.id === id ? { ...t, ...dados } : t)),
        })),

      removerTransacao: (id) =>
        set((estado) => ({
          transacoes: estado.transacoes.filter((t) => t.id !== id),
        })),

      registrarPagamentoDivida: (id, valorPago) =>
        set((estado) => ({
          dividas: estado.dividas.map((d) =>
            d.id === id ? { ...d, saldoDevedor: Math.max(0, d.saldoDevedor - valorPago) } : d,
          ),
        })),

      atualizarDivida: (id, dados) =>
        set((estado) => ({
          dividas: estado.dividas.map((d) => (d.id === id ? { ...d, ...dados } : d)),
        })),

      marcarConteudoLido: (id, lido) =>
        set((estado) => ({
          conteudosLidos: lido ? Array.from(new Set([...estado.conteudosLidos, id])) : estado.conteudosLidos.filter((c) => c !== id),
        })),

      restaurarDadosDeExemplo: () => set({ ...estadoInicial }),
    }),
    { name: "rota-zero-finance-store" },
  ),
);
