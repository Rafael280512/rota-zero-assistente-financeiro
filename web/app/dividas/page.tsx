"use client";

import { useFinanceStore } from "@/store/useFinanceStore";
import { useDashboardData } from "@/hooks/useDashboardData";
import HoloPanel from "@/components/ui/HoloPanel";
import StatPod from "@/components/ui/StatPod";
import EstrategiaComparativo from "@/components/dividas/EstrategiaComparativo";
import CartaoDivida from "@/components/dividas/CartaoDivida";
import PainelVitorias from "@/components/dividas/PainelVitorias";
import { ordenarPorEstrategia } from "@/utils/debtStrategy";

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function DividasPage() {
  const dividas = useFinanceStore((s) => s.dividas);
  const { saldoMensal } = useDashboardData();

  const dividasAtivas = ordenarPorEstrategia(
    dividas.filter((d) => d.saldoDevedor > 0),
    "avalanche",
  );
  const dividasQuitadas = dividas.filter((d) => d.saldoDevedor <= 0);
  const totalSaldoDevedor = dividasAtivas.reduce((soma, d) => soma + d.saldoDevedor, 0);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs uppercase tracking-widest text-neon-orange">Modulo 2</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Terapia de Dividas · O Ponto Zero</h1>
        <p className="mt-1 text-sm text-ice/50">
          Priorize com Bola de Neve ou Avalanche, simule renegociacoes e comemore cada divida quitada.
        </p>
      </div>

      <HoloPanel acento="orange" className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatPod rotulo="Dividas ativas" valor={dividasAtivas.length} tom={dividasAtivas.length > 0 ? "orange" : "emerald"} />
        <StatPod rotulo="Saldo devedor total" valor={formatarMoeda(totalSaldoDevedor)} tom="red" />
        <StatPod rotulo="Dividas quitadas" valor={dividasQuitadas.length} tom="emerald" />
        <StatPod rotulo="Aporte extra sugerido" valor={formatarMoeda(Math.max(0, saldoMensal))} tom="cyan" />
      </HoloPanel>

      {dividasAtivas.length > 0 ? (
        <>
          <EstrategiaComparativo dividasAtivas={dividasAtivas} aporteSugerido={saldoMensal} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {dividasAtivas.map((divida, indice) => (
              <CartaoDivida key={divida.id} divida={divida} prioridade={indice + 1} />
            ))}
          </div>
        </>
      ) : (
        <HoloPanel acento="emerald" className="text-center">
          <p className="text-sm text-neon-emerald">Nenhuma divida em aberto. Voce chegou ao Ponto Zero!</p>
        </HoloPanel>
      )}

      <PainelVitorias dividasQuitadas={dividasQuitadas} />
    </div>
  );
}
