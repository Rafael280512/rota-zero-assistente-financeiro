"use client";

import { AlertTriangle, TrendingDown } from "lucide-react";

import HoloPanel from "@/components/ui/HoloPanel";
import StatPod from "@/components/ui/StatPod";
import ProgressBeam from "@/components/ui/ProgressBeam";
import FluxoDeCaixaChart from "@/components/charts/FluxoDeCaixaChart";
import GastosReactorChart from "@/components/charts/GastosReactorChart";
import ProjecaoJurosChart from "@/components/charts/ProjecaoJurosChart";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useJourneyPhase } from "@/hooks/useJourneyPhase";

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function DashboardPage() {
  const dados = useDashboardData();
  const { reservaPercentual, reservaCompleta } = useJourneyPhase();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs uppercase tracking-widest text-neon-cyan">Modulo 1</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Central de Comando</h1>
        <p className="mt-1 text-sm text-ice/50">Visao macro do seu patrimonio e do impacto das suas decisoes ao longo do tempo.</p>
      </div>

      <HoloPanel acento="cyan" className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatPod
          rotulo="Patrimonio liquido"
          valor={formatarMoeda(dados.patrimonioLiquido)}
          tom={dados.patrimonioLiquido >= 0 ? "emerald" : "red"}
        />
        <StatPod rotulo="Saldo do mes" valor={formatarMoeda(dados.saldoMensal)} tom={dados.saldoMensal >= 0 ? "emerald" : "red"} />
        <StatPod rotulo="Total em dividas" valor={formatarMoeda(dados.totalDividas)} tom={dados.totalDividas > 0 ? "orange" : "emerald"} />
        <div>
          <StatPod rotulo="Reserva de emergencia" valor={`${reservaPercentual}%`} tom={reservaCompleta ? "emerald" : "cyan"} />
          <div className="mt-2">
            <ProgressBeam percentual={reservaPercentual} cor={reservaCompleta ? "emerald" : "cyan"} completo={reservaCompleta} />
          </div>
        </div>
      </HoloPanel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <HoloPanel acento="cyan">
          <h3 className="text-sm font-semibold text-white">Fluxo de Caixa</h3>
          <p className="text-xs text-ice/40">Saldo acumulado ao longo das transacoes registradas.</p>
          <div className="mt-2">
            <FluxoDeCaixaChart dados={dados.fluxo} />
          </div>
        </HoloPanel>

        <HoloPanel acento="orange">
          <h3 className="text-sm font-semibold text-white">Distribuicao de Gastos</h3>
          <p className="text-xs text-ice/40">Para onde seu dinheiro esta indo por categoria.</p>
          <div className="mt-2">
            <GastosReactorChart dados={dados.gastos} />
          </div>
        </HoloPanel>
      </div>

      <HoloPanel acento="emerald">
        <div className="flex items-center gap-2">
          <TrendingDown size={16} className="text-neon-emerald" />
          <h3 className="text-sm font-semibold text-white">Juros Compostos: a Favor ou Contra Voce</h3>
        </div>
        <p className="text-xs text-ice/40">
          Projecao de 10 anos: seu saldo positivo investido a ~0,8% a.m. vs. o custo da sua divida mais cara se
          ficar 2 anos sem nenhum pagamento (depois disso, o realista e renegociar antes que vire bola de neve).
        </p>
        <div className="mt-2">
          <ProjecaoJurosChart dados={dados.projecao} />
        </div>
      </HoloPanel>

      {dados.alertas.length > 0 && (
        <HoloPanel acento="red">
          <h3 className="text-sm font-semibold text-white">Alertas Inteligentes</h3>
          <ul className="mt-3 flex flex-col gap-2">
            {dados.alertas.map((alerta, indice) => (
              <li
                key={indice}
                className={`flex items-start gap-2.5 rounded-sm border px-3 py-2 text-sm ${
                  alerta.severidade === "critico"
                    ? "border-neon-red/30 bg-neon-red/5 text-neon-red"
                    : "border-neon-orange/30 bg-neon-orange/5 text-neon-orange"
                }`}
              >
                <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium capitalize">{alerta.titulo}</p>
                  <p className="text-xs opacity-70">{alerta.descricao}</p>
                </div>
              </li>
            ))}
          </ul>
        </HoloPanel>
      )}
    </div>
  );
}
