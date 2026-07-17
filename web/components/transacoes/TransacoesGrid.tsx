"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUp, ArrowUpDown, Plus, Search, Trash2 } from "lucide-react";

import { useFinanceStore, type Transacao } from "@/store/useFinanceStore";
import NeonButton from "@/components/ui/NeonButton";
import StatPod from "@/components/ui/StatPod";

type CampoOrdenacao = "data" | "descricao" | "categoria" | "valor";
type Ordem = "asc" | "desc";
type FiltroTipo = "todos" | "entrada" | "saida";

const CATEGORIAS_PADRAO = ["moradia", "alimentacao", "transporte", "saude", "lazer", "receita", "outros"];

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function hoje(): string {
  return new Date().toISOString().slice(0, 10);
}

function IconeOrdenacao({ ativo, ordem }: { ativo: boolean; ordem: Ordem }) {
  if (!ativo) return <ArrowUpDown size={13} className="opacity-30" />;
  return ordem === "asc" ? <ArrowUp size={13} className="text-neon-cyan" /> : <ArrowDown size={13} className="text-neon-cyan" />;
}

export default function TransacoesGrid() {
  const transacoes = useFinanceStore((s) => s.transacoes);
  const adicionarTransacao = useFinanceStore((s) => s.adicionarTransacao);
  const atualizarTransacao = useFinanceStore((s) => s.atualizarTransacao);
  const removerTransacao = useFinanceStore((s) => s.removerTransacao);

  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("todos");
  const [ordenarPor, setOrdenarPor] = useState<CampoOrdenacao>("data");
  const [ordem, setOrdem] = useState<Ordem>("desc");
  const [selecionadas, setSelecionadas] = useState<Set<string>>(new Set());
  const [categoriaEmMassa, setCategoriaEmMassa] = useState("");

  const categorias = useMemo(() => {
    const unicas = new Set([...CATEGORIAS_PADRAO, ...transacoes.map((t) => t.categoria)]);
    return Array.from(unicas).sort();
  }, [transacoes]);

  const filtradas = useMemo(() => {
    const termoBusca = busca.trim().toLowerCase();
    const lista = transacoes.filter((t) => {
      const bateBusca = !termoBusca || t.descricao.toLowerCase().includes(termoBusca);
      const bateCategoria = filtroCategoria === "todas" || t.categoria === filtroCategoria;
      const bateTipo = filtroTipo === "todos" || t.tipo === filtroTipo;
      return bateBusca && bateCategoria && bateTipo;
    });

    const dir = ordem === "asc" ? 1 : -1;
    return [...lista].sort((a, b) => {
      if (ordenarPor === "valor") return (a.valor - b.valor) * dir;
      return a[ordenarPor].localeCompare(b[ordenarPor]) * dir;
    });
  }, [transacoes, busca, filtroCategoria, filtroTipo, ordenarPor, ordem]);

  const totais = useMemo(() => {
    const entradas = filtradas.filter((t) => t.tipo === "entrada").reduce((soma, t) => soma + t.valor, 0);
    const saidas = filtradas.filter((t) => t.tipo === "saida").reduce((soma, t) => soma + t.valor, 0);
    return { entradas, saidas, saldo: entradas - saidas };
  }, [filtradas]);

  function alternarOrdenacao(campo: CampoOrdenacao) {
    if (ordenarPor === campo) {
      setOrdem((atual) => (atual === "asc" ? "desc" : "asc"));
    } else {
      setOrdenarPor(campo);
      setOrdem("asc");
    }
  }

  function alternarSelecao(id: string) {
    setSelecionadas((atual) => {
      const novo = new Set(atual);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });
  }

  function alternarSelecionarTodas() {
    setSelecionadas((atual) => (atual.size === filtradas.length ? new Set() : new Set(filtradas.map((t) => t.id))));
  }

  function aplicarCategoriaEmMassa() {
    const categoria = categoriaEmMassa.trim().toLowerCase();
    if (!categoria) return;
    selecionadas.forEach((id) => atualizarTransacao(id, { categoria }));
    setSelecionadas(new Set());
    setCategoriaEmMassa("");
  }

  function removerSelecionadas() {
    selecionadas.forEach((id) => removerTransacao(id));
    setSelecionadas(new Set());
  }

  function novaTransacao() {
    adicionarTransacao({ data: hoje(), descricao: "", categoria: "outros", valor: 0, tipo: "saida" });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="holo-panel grid grid-cols-1 gap-4 rounded-sm p-5 sm:grid-cols-3">
        <StatPod rotulo="Entradas (filtro)" valor={formatarMoeda(totais.entradas)} tom="emerald" />
        <StatPod rotulo="Saidas (filtro)" valor={formatarMoeda(totais.saidas)} tom="red" />
        <StatPod
          rotulo="Saldo (filtro)"
          valor={formatarMoeda(totais.saldo)}
          tom={totais.saldo >= 0 ? "emerald" : "red"}
        />
      </div>

      <div className="holo-panel rounded-sm">
        <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-xs">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ice/30" />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar descricao..."
                className="w-full rounded-sm border border-white/10 bg-white/5 py-2 pl-8 pr-3 text-sm text-ice outline-none placeholder:text-ice/30 focus:border-neon-cyan/50"
              />
            </div>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="rounded-sm border border-white/10 bg-white/5 px-3 py-2 text-sm text-ice outline-none focus:border-neon-cyan/50"
            >
              <option value="todas">Todas categorias</option>
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria} className="bg-holo-navy">
                  {categoria}
                </option>
              ))}
            </select>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value as FiltroTipo)}
              className="rounded-sm border border-white/10 bg-white/5 px-3 py-2 text-sm text-ice outline-none focus:border-neon-cyan/50"
            >
              <option value="todos">Entradas e saidas</option>
              <option value="entrada">So entradas</option>
              <option value="saida">So saidas</option>
            </select>
          </div>

          <NeonButton type="button" variante="cyan" onClick={novaTransacao} className="flex items-center gap-1.5">
            <Plus size={15} /> Nova transacao
          </NeonButton>
        </div>

        <AnimatePresence>
          {selecionadas.size > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col gap-2 overflow-hidden border-b border-neon-cyan/20 bg-neon-cyan/5 px-4 py-3 sm:flex-row sm:items-center"
            >
              <span className="text-xs font-medium text-neon-cyan">{selecionadas.size} selecionada(s)</span>
              <div className="flex flex-1 flex-wrap items-center gap-2">
                <input
                  value={categoriaEmMassa}
                  onChange={(e) => setCategoriaEmMassa(e.target.value)}
                  placeholder="Nova categoria em massa"
                  list="categorias-existentes"
                  className="rounded-sm border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-ice outline-none placeholder:text-ice/30 focus:border-neon-cyan/50"
                />
                <NeonButton type="button" variante="ghost" onClick={aplicarCategoriaEmMassa} className="text-xs">
                  Aplicar categoria
                </NeonButton>
                <button
                  type="button"
                  onClick={removerSelecionadas}
                  className="flex items-center gap-1 rounded-sm border border-neon-red/40 bg-neon-red/10 px-3 py-1.5 text-xs text-neon-red hover:bg-neon-red/20"
                >
                  <Trash2 size={13} /> Excluir selecionadas
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <datalist id="categorias-existentes">
          {categorias.map((categoria) => (
            <option key={categoria} value={categoria} />
          ))}
        </datalist>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-ice/40">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={filtradas.length > 0 && selecionadas.size === filtradas.length}
                    onChange={alternarSelecionarTodas}
                    className="accent-cyan-400"
                  />
                </th>
                <th className="px-2 py-3">
                  <button type="button" onClick={() => alternarOrdenacao("data")} className="flex items-center gap-1 hover:text-ice">
                    Data <IconeOrdenacao ativo={ordenarPor === "data"} ordem={ordem} />
                  </button>
                </th>
                <th className="px-2 py-3">
                  <button
                    type="button"
                    onClick={() => alternarOrdenacao("descricao")}
                    className="flex items-center gap-1 hover:text-ice"
                  >
                    Descricao <IconeOrdenacao ativo={ordenarPor === "descricao"} ordem={ordem} />
                  </button>
                </th>
                <th className="px-2 py-3">
                  <button
                    type="button"
                    onClick={() => alternarOrdenacao("categoria")}
                    className="flex items-center gap-1 hover:text-ice"
                  >
                    Categoria <IconeOrdenacao ativo={ordenarPor === "categoria"} ordem={ordem} />
                  </button>
                </th>
                <th className="px-2 py-3">Tipo</th>
                <th className="px-2 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => alternarOrdenacao("valor")}
                    className="ml-auto flex items-center gap-1 hover:text-ice"
                  >
                    Valor <IconeOrdenacao ativo={ordenarPor === "valor"} ordem={ordem} />
                  </button>
                </th>
                <th className="w-10 px-2 py-3" />
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {filtradas.map((transacao) => (
                  <LinhaTransacao
                    key={transacao.id}
                    transacao={transacao}
                    selecionada={selecionadas.has(transacao.id)}
                    onSelecionar={() => alternarSelecao(transacao.id)}
                    onAtualizar={(dados) => atualizarTransacao(transacao.id, dados)}
                    onRemover={() => removerTransacao(transacao.id)}
                  />
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {filtradas.length === 0 && (
            <p className="px-4 py-10 text-center text-sm text-ice/30">Nenhuma transacao encontrada com esses filtros.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function LinhaTransacao({
  transacao,
  selecionada,
  onSelecionar,
  onAtualizar,
  onRemover,
}: {
  transacao: Transacao;
  selecionada: boolean;
  onSelecionar: () => void;
  onAtualizar: (dados: Partial<Omit<Transacao, "id">>) => void;
  onRemover: () => void;
}) {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
      className={`border-b border-white/5 transition-colors ${selecionada ? "bg-neon-cyan/5" : "hover:bg-white/[0.03]"}`}
    >
      <td className="px-4 py-1.5">
        <input type="checkbox" checked={selecionada} onChange={onSelecionar} className="accent-cyan-400" />
      </td>
      <td className="px-2 py-1.5">
        <input
          type="date"
          value={transacao.data}
          onChange={(e) => onAtualizar({ data: e.target.value })}
          className="w-32 rounded-sm border border-transparent bg-transparent px-1 py-1 text-ice/80 outline-none focus:border-neon-cyan/40 focus:bg-white/5"
        />
      </td>
      <td className="px-2 py-1.5">
        <input
          type="text"
          value={transacao.descricao}
          onChange={(e) => onAtualizar({ descricao: e.target.value })}
          placeholder="Descricao"
          className="w-full min-w-[10rem] rounded-sm border border-transparent bg-transparent px-1 py-1 text-ice outline-none placeholder:text-ice/30 focus:border-neon-cyan/40 focus:bg-white/5"
        />
      </td>
      <td className="px-2 py-1.5">
        <input
          type="text"
          list="categorias-existentes"
          value={transacao.categoria}
          onChange={(e) => onAtualizar({ categoria: e.target.value.toLowerCase() })}
          className="w-32 rounded-sm border border-transparent bg-transparent px-1 py-1 capitalize text-ice/70 outline-none focus:border-neon-cyan/40 focus:bg-white/5"
        />
      </td>
      <td className="px-2 py-1.5">
        <button
          type="button"
          onClick={() => onAtualizar({ tipo: transacao.tipo === "entrada" ? "saida" : "entrada" })}
          className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
            transacao.tipo === "entrada"
              ? "border-neon-emerald/40 bg-neon-emerald/10 text-neon-emerald"
              : "border-neon-red/40 bg-neon-red/10 text-neon-red"
          }`}
        >
          {transacao.tipo === "entrada" ? "Entrada" : "Saida"}
        </button>
      </td>
      <td className="px-2 py-1.5 text-right">
        <input
          type="number"
          step="0.01"
          value={transacao.valor}
          onChange={(e) => onAtualizar({ valor: Number(e.target.value) || 0 })}
          className="w-24 rounded-sm border border-transparent bg-transparent px-1 py-1 text-right tabular-nums text-ice outline-none focus:border-neon-cyan/40 focus:bg-white/5"
        />
      </td>
      <td className="px-2 py-1.5 text-right">
        <button type="button" onClick={onRemover} className="rounded-sm p-1.5 text-ice/30 hover:bg-neon-red/10 hover:text-neon-red">
          <Trash2 size={14} />
        </button>
      </td>
    </motion.tr>
  );
}
