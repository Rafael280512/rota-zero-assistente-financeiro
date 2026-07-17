"use client";

import { useMemo, useState } from "react";
import { Flame, Snowflake } from "lucide-react";

import type { Divida } from "@/store/useFinanceStore";
import HoloPanel from "@/components/ui/HoloPanel";
import QuitacaoChart from "@/components/charts/QuitacaoChart";
import { compararEstrategias, ordenarPorEstrategia, type EstrategiaQuitacao } from "@/utils/debtStrategy";

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function EstrategiaComparativo({
  dividasAtivas,
  aporteSugerido,
}: {
  dividasAtivas: Divida[];
  aporteSugerido: number;
}) {
  const [aporteExtra, setAporteExtra] = useState(String(Math.max(0, Math.round(aporteSugerido))));
  const [estrategia, setEstrategia] = useState<EstrategiaQuitacao>("avalanche");

  const comparativo = useMemo(
    () => compararEstrategias(dividasAtivas, Number(aporteExtra) || 0),
    [dividasAtivas, aporteExtra],
  );

  const prioridades = useMemo(() => ordenarPorEstrategia(dividasAtivas, estrategia), [dividasAtivas, estrategia]);

  const resultadoSelecionado = estrategia === "bola_de_neve" ? comparativo.bolaDeNeve : comparativo.avalanche;

  return (
    <HoloPanel acento="cyan">
      <h3 className="text-sm font-semibold text-white">Bola de Neve vs Avalanche</h3>
      <p className="text-xs text-ice/40">
        Simulacao real: minimo em todas as dividas + todo orcamento extra na prioridade da estrategia.
      </p>

      <label className="mt-3 flex flex-col gap-1 text-xs text-ice/50 sm:max-w-xs">
        Quanto voce pode destinar alem do minimo, por mes?
        <input
          type="number"
          value={aporteExtra}
          onChange={(e) => setAporteExtra(e.target.value)}
          className="rounded-sm border border-white/10 bg-white/5 px-3 py-2 text-sm text-ice outline-none focus:border-neon-cyan/50"
        />
      </label>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setEstrategia("bola_de_neve")}
          className={`rounded-sm border p-3 text-left transition-colors ${
            estrategia === "bola_de_neve" ? "border-neon-orange/50 bg-neon-orange/10" : "border-white/10 bg-white/5 hover:border-neon-orange/30"
          }`}
        >
          <div className="flex items-center gap-1.5 text-sm font-medium text-neon-orange">
            <Snowflake size={14} /> Bola de Neve
          </div>
          <p className="mt-1 text-xs text-ice/40">Ataca a menor divida primeiro. Vitorias rapidas, motivacao.</p>
          <div className="mt-2 flex gap-4 text-sm">
            <span className="text-white">{comparativo.bolaDeNeve.meses} meses</span>
            <span className="text-ice/50">{formatarMoeda(comparativo.bolaDeNeve.totalJurosPago)} em juros</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setEstrategia("avalanche")}
          className={`rounded-sm border p-3 text-left transition-colors ${
            estrategia === "avalanche" ? "border-neon-cyan/50 bg-neon-cyan/10" : "border-white/10 bg-white/5 hover:border-neon-cyan/30"
          }`}
        >
          <div className="flex items-center gap-1.5 text-sm font-medium text-neon-cyan">
            <Flame size={14} /> Avalanche
          </div>
          <p className="mt-1 text-xs text-ice/40">Ataca o maior juros primeiro. Matematicamente mais barato.</p>
          <div className="mt-2 flex gap-4 text-sm">
            <span className="text-white">{comparativo.avalanche.meses} meses</span>
            <span className="text-ice/50">{formatarMoeda(comparativo.avalanche.totalJurosPago)} em juros</span>
          </div>
        </button>
      </div>

      {comparativo.economiaJurosAvalanche > 0.5 && (
        <p className="mt-3 rounded-sm border border-neon-emerald/30 bg-neon-emerald/10 px-3 py-2 text-xs text-neon-emerald">
          Avalanche economiza {formatarMoeda(comparativo.economiaJurosAvalanche)} em juros
          {comparativo.mesesGanhosAvalanche > 0 ? ` e termina ${comparativo.mesesGanhosAvalanche} mes(es) antes` : ""} comparado a Bola de
          Neve.
        </p>
      )}

      <div className="mt-4">
        <p className="mb-2 text-xs uppercase tracking-widest text-ice/40">
          Ordem de ataque · {estrategia === "bola_de_neve" ? "Bola de Neve" : "Avalanche"}
        </p>
        <ol className="flex flex-col gap-1.5">
          {prioridades.map((divida, indice) => (
            <li key={divida.id} className="flex items-center justify-between rounded-sm border border-white/10 bg-white/5 px-3 py-1.5 text-sm">
              <span className="flex items-center gap-2 text-ice/80">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neon-cyan/15 text-[11px] font-semibold text-neon-cyan">
                  {indice + 1}
                </span>
                {divida.credor}
              </span>
              <span className="text-xs text-ice/40">
                {formatarMoeda(divida.saldoDevedor)} · {(divida.taxaJurosMensal * 100).toFixed(1)}% a.m.
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-4">
        <p className="mb-1 text-xs uppercase tracking-widest text-ice/40">Saldo total devedor ao longo do tempo</p>
        <QuitacaoChart bolaDeNeve={comparativo.bolaDeNeve.linhaDoTempo} avalanche={comparativo.avalanche.linhaDoTempo} />
      </div>

      {resultadoSelecionado.estourouLimite && (
        <p className="mt-2 text-xs text-neon-red">
          Com esse orcamento, a quitacao passaria de 50 anos. Tente aumentar o aporte extra.
        </p>
      )}
    </HoloPanel>
  );
}
