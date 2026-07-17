"use client";

import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";

import type { Divida } from "@/store/useFinanceStore";
import { useFinanceStore } from "@/store/useFinanceStore";
import HoloPanel from "@/components/ui/HoloPanel";
import NeonButton from "@/components/ui/NeonButton";
import ProgressBeam from "@/components/ui/ProgressBeam";
import StatPod from "@/components/ui/StatPod";
import { calcularAmortizacaoPrice } from "@/utils/financialMath";

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const CATEGORIA_LABEL: Record<string, string> = {
  cartao_credito: "Cartao de credito",
  financiamento_veiculo: "Financiamento de veiculo",
  emprestimo_pessoal: "Emprestimo pessoal",
};

export default function CartaoDivida({ divida, prioridade }: { divida: Divida; prioridade?: number }) {
  const registrarPagamentoDivida = useFinanceStore((s) => s.registrarPagamentoDivida);

  const [valorPagamento, setValorPagamento] = useState("");
  const [simulando, setSimulando] = useState(false);
  const [novaTaxaPercentual, setNovaTaxaPercentual] = useState((divida.taxaJurosMensal * 100).toFixed(1));

  const percentualPago = divida.valorOriginal > 0 ? ((divida.valorOriginal - divida.saldoDevedor) / divida.valorOriginal) * 100 : 0;

  const cenarioAtual = calcularAmortizacaoPrice(divida.saldoDevedor, divida.taxaJurosMensal, divida.parcelasRestantes);
  const novaTaxaDecimal = (Number(novaTaxaPercentual) || 0) / 100;
  const cenarioRenegociado = calcularAmortizacaoPrice(divida.saldoDevedor, novaTaxaDecimal, divida.parcelasRestantes);
  const economiaRenegociacao = cenarioAtual.totalJuros - cenarioRenegociado.totalJuros;

  function registrarPagamento() {
    const valor = Number(valorPagamento);
    if (!valor || valor <= 0) return;
    registrarPagamentoDivida(divida.id, valor);
    setValorPagamento("");
  }

  return (
    <HoloPanel acento={divida.taxaJurosMensal >= 0.05 ? "red" : "orange"}>
      <div className="flex items-start justify-between gap-2">
        <div>
          {prioridade !== undefined && (
            <span className="text-[11px] font-semibold uppercase tracking-widest text-neon-cyan">#{prioridade} prioridade</span>
          )}
          <h3 className="mt-0.5 text-base font-semibold text-white">{divida.credor}</h3>
          <p className="text-xs text-ice/40">{CATEGORIA_LABEL[divida.categoria] ?? divida.categoria}</p>
        </div>
        <span className="whitespace-nowrap rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-ice/50">
          {divida.parcelasRestantes}x restantes
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        <StatPod rotulo="Saldo devedor" valor={formatarMoeda(divida.saldoDevedor)} tom="red" />
        <StatPod rotulo="Juros a.m." valor={`${(divida.taxaJurosMensal * 100).toFixed(1)}%`} tom={divida.taxaJurosMensal >= 0.05 ? "red" : "orange"} />
        <StatPod rotulo="Parcela" valor={formatarMoeda(divida.valorParcela)} />
      </div>

      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-xs text-ice/40">
          <span>Ja quitado</span>
          <span>{percentualPago.toFixed(0)}%</span>
        </div>
        <ProgressBeam percentual={percentualPago} cor="emerald" />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          type="number"
          step="0.01"
          value={valorPagamento}
          onChange={(e) => setValorPagamento(e.target.value)}
          placeholder="Registrar pagamento (R$)"
          className="w-full rounded-sm border border-white/10 bg-white/5 px-3 py-2 text-sm text-ice outline-none placeholder:text-ice/30 focus:border-neon-emerald/50"
        />
        <NeonButton type="button" variante="emerald" onClick={registrarPagamento} className="whitespace-nowrap">
          Pagar
        </NeonButton>
      </div>

      <button
        type="button"
        onClick={() => setSimulando((atual) => !atual)}
        className="mt-3 flex w-full items-center justify-between text-xs text-ice/50 hover:text-neon-cyan"
      >
        <span className="flex items-center gap-1.5">
          <Sparkles size={13} /> Simular renegociacao
        </span>
        <ChevronDown size={14} className={`transition-transform ${simulando ? "rotate-180" : ""}`} />
      </button>

      {simulando && (
        <div className="mt-3 rounded-sm border border-neon-cyan/20 bg-neon-cyan/5 p-3">
          <label className="flex items-center justify-between text-xs text-ice/60">
            <span>Nova taxa negociada (% a.m.)</span>
            <span className="font-semibold text-neon-cyan">{novaTaxaPercentual}%</span>
          </label>
          <input
            type="range"
            min={0}
            max={(divida.taxaJurosMensal * 100).toFixed(1)}
            step={0.1}
            value={novaTaxaPercentual}
            onChange={(e) => setNovaTaxaPercentual(e.target.value)}
            className="mt-2 w-full accent-cyan-400"
          />
          <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-ice/40">Parcela nova</p>
              <p className="text-sm font-semibold text-white">{formatarMoeda(cenarioRenegociado.parcelas[0]?.parcela ?? 0)}</p>
            </div>
            <div>
              <p className="text-ice/40">Economia em juros</p>
              <p className="text-sm font-semibold text-neon-emerald">{formatarMoeda(Math.max(0, economiaRenegociacao))}</p>
            </div>
          </div>
        </div>
      )}
    </HoloPanel>
  );
}
