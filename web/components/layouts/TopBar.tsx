"use client";

import { useJourneyPhase, type FaseJornada } from "@/hooks/useJourneyPhase";

const FASE_LABEL: Record<FaseJornada, string> = {
  diagnostico: "Diagnostico",
  reconstrucao: "Reconstrucao",
  planejamento: "Planejamento",
};

const FASE_COR: Record<FaseJornada, string> = {
  diagnostico: "text-neon-orange border-neon-orange/40 bg-neon-orange/10",
  reconstrucao: "text-neon-cyan border-neon-cyan/40 bg-neon-cyan/10",
  planejamento: "text-neon-emerald border-neon-emerald/40 bg-neon-emerald/10",
};

export default function TopBar() {
  const { fase } = useJourneyPhase();

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-neon-cyan/10 bg-holo-void/60 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-2.5">
        <span className="text-xl">🧭</span>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-wide text-ice">ROTA ZERO</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-ice/40">Command Center</p>
        </div>
      </div>

      <span
        className={`rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-widest ${FASE_COR[fase]}`}
      >
        {FASE_LABEL[fase]}
      </span>
    </header>
  );
}
