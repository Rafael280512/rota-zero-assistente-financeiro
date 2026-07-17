"use client";

import { useJourneyPhase } from "@/hooks/useJourneyPhase";

export default function InvestimentosPage() {
  const { investimentosLiberados, temDividasEmAberto, reservaPercentual, fase } = useJourneyPhase();

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-8 text-center text-zinc-300">
      <div>
        <p className="text-xs uppercase tracking-widest text-cyan-400">Modulo 5</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Central de Investimentos</h1>

        {investimentosLiberados ? (
          <p className="mt-2 max-w-md text-sm text-emerald-400">
            Liberado: voce esta na fase de planejamento, sem dividas em aberto e com a reserva de emergencia
            completa. Alocacao de ativos e metas de longo prazo chegam no Passo 3/4.
          </p>
        ) : (
          <div className="mt-2 max-w-md text-sm text-amber-400">
            <p>
              Bloqueado (fase atual: {fase}). O Rota Zero so libera recomendacoes de investimento depois que voce
              quita as dividas em aberto e completa a reserva de emergencia.
            </p>
            <ul className="mt-3 space-y-1 text-left text-xs text-zinc-400">
              <li>Dividas em aberto: {temDividasEmAberto ? "sim" : "nao"}</li>
              <li>Reserva de emergencia: {reservaPercentual}% completa</li>
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
