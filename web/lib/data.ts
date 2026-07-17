import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");

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
  data: string;
  descricao: string;
  categoria: string;
  valor: number;
  tipo: "entrada" | "saida";
}

export interface Atendimento {
  data: string;
  canal: string;
  tema: string;
  resumo: string;
  resolvido: string;
}

function parseCsv(conteudo: string): Record<string, string>[] {
  const linhas = conteudo.trim().split(/\r?\n/);
  const cabecalho = linhas[0].split(",").map((valor) => valor.trim());
  return linhas.slice(1).map((linha) => {
    const valores = linha.split(",").map((valor) => valor.trim());
    return Object.fromEntries(cabecalho.map((chave, i) => [chave, valores[i]]));
  });
}

export function carregarPerfil(): Perfil {
  const conteudo = fs.readFileSync(path.join(DATA_DIR, "perfil_investidor.json"), "utf-8");
  return JSON.parse(conteudo);
}

export function carregarProdutos(): Produto[] {
  const conteudo = fs.readFileSync(path.join(DATA_DIR, "produtos_financeiros.json"), "utf-8");
  return JSON.parse(conteudo);
}

export function carregarTransacoes(): Transacao[] {
  const conteudo = fs.readFileSync(path.join(DATA_DIR, "transacoes.csv"), "utf-8");
  return parseCsv(conteudo).map((linha) => ({
    data: linha.data,
    descricao: linha.descricao,
    categoria: linha.categoria,
    valor: Number(linha.valor),
    tipo: linha.tipo as "entrada" | "saida",
  }));
}

export function carregarHistorico(): Atendimento[] {
  const conteudo = fs.readFileSync(path.join(DATA_DIR, "historico_atendimento.csv"), "utf-8");
  return parseCsv(conteudo).map((linha) => ({
    data: linha.data,
    canal: linha.canal,
    tema: linha.tema,
    resumo: linha.resumo,
    resolvido: linha.resolvido,
  }));
}

export function montarContexto(): string {
  const perfil = carregarPerfil();
  const produtos = carregarProdutos();
  const transacoes = carregarTransacoes();
  const historico = carregarHistorico();

  const partes = [
    "PERFIL DO CLIENTE:",
    JSON.stringify(perfil, null, 2),
    "PRODUTOS FINANCEIROS DISPONIVEIS:",
    JSON.stringify(produtos, null, 2),
    "ULTIMAS TRANSACOES:",
    transacoes
      .slice(-10)
      .map((t) => `${t.data} | ${t.descricao} | ${t.categoria} | ${t.valor} | ${t.tipo}`)
      .join("\n"),
    "HISTORICO DE ATENDIMENTO:",
    historico
      .map((h) => `${h.data} | ${h.canal} | ${h.tema} | ${h.resumo} | resolvido=${h.resolvido}`)
      .join("\n"),
  ];

  return partes.join("\n\n");
}

export interface Resumo {
  totalEntradas: number;
  totalSaidas: number;
  saldoMensal: number;
  reservaEmergenciaAlvo: number;
  reservaEmergenciaPercentual: number;
  gastosPorCategoria: { categoria: string; valor: number }[];
}

export function montarResumoFinanceiro(): Resumo {
  const perfil = carregarPerfil();
  const transacoes = carregarTransacoes();

  const totalEntradas = transacoes.filter((t) => t.tipo === "entrada").reduce((s, t) => s + t.valor, 0);
  const totalSaidas = transacoes.filter((t) => t.tipo === "saida").reduce((s, t) => s + t.valor, 0);

  const metaReserva = perfil.metas.find((m) => m.meta.toLowerCase().includes("reserva"));
  const reservaAlvo = metaReserva?.valor_necessario ?? perfil.reserva_emergencia_atual;

  const gastosMap = new Map<string, number>();
  for (const t of transacoes) {
    if (t.tipo !== "saida") continue;
    gastosMap.set(t.categoria, (gastosMap.get(t.categoria) ?? 0) + t.valor);
  }
  const gastosPorCategoria = Array.from(gastosMap.entries())
    .map(([categoria, valor]) => ({ categoria, valor }))
    .sort((a, b) => b.valor - a.valor);

  return {
    totalEntradas,
    totalSaidas,
    saldoMensal: totalEntradas - totalSaidas,
    reservaEmergenciaAlvo: reservaAlvo,
    reservaEmergenciaPercentual: Math.min(100, Math.round((perfil.reserva_emergencia_atual / reservaAlvo) * 100)),
    gastosPorCategoria,
  };
}
