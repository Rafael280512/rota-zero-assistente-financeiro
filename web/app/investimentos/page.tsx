"use client";

import HoloPanel from "@/components/ui/HoloPanel";
import ProgressBeam from "@/components/ui/ProgressBeam";
import { useJourneyPhase } from "@/hooks/useJourneyPhase";

export default function InvestimentosPage() {
  const { investimentosLiberados, temDividasEmAberto, reservaPercentual, fase } = useJourneyPhase();

  return (
    <HoloPanel acento={investimentosLiberados ? "emerald" : "orange"} className="mx-auto max-w-xl text-center">
      <p className={`text-xs uppercase tracking-widest ${investimentosLiberados ? "text-neon-emerald" : "text-neon-orange"}`}>
        Modulo 5
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-white">Central de Investimentos</h1>

      {investimentosLiberados ? (
        <p className="mt-3 text-sm text-neon-emerald">
          Liberado: voce esta na fase de planejamento, sem dividas em aberto e com a reserva de emergencia completa.
          Alocacao de ativos e metas de longo prazo chegam no proximo passo.
        </p>
      ) : (
        <div className="mt-3 text-left text-sm text-ice/70">
          <p>
            Bloqueado (fase atual: <span className="font-medium text-neon-orange">{fase}</span>). O Rota Zero so
            libera recomendacoes de investimento depois que voce quita as dividas em aberto e completa a reserva de
            emergencia.
          </p>
          <div className="mt-4 space-y-3 text-xs text-ice/50">
            <div className="flex items-center justify-between">
              <span>Dividas em aberto</span>
              <span className={temDividasEmAberto ? "text-neon-red" : "text-neon-emerald"}>
                {temDividasEmAberto ? "sim" : "nao"}
              </span>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span>Reserva de emergencia</span>
                <span>{reservaPercentual}%</span>
              </div>
              <ProgressBeam percentual={reservaPercentual} cor="orange" />
            </div>
          </div>
        </div>
      )}
    </HoloPanel>
  );
}
