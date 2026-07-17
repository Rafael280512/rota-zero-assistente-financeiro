import type { Perfil, Resumo } from "@/lib/data";
import HoloPanel from "@/components/ui/HoloPanel";
import ProgressBeam from "@/components/ui/ProgressBeam";
import StatPod from "@/components/ui/StatPod";

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Dashboard({ perfil, resumo }: { perfil: Perfil; resumo: Resumo }) {
  const saldoPositivo = resumo.saldoMensal >= 0;

  return (
    <aside className="flex flex-col gap-4">
      <HoloPanel acento="cyan">
        <p className="text-xs font-medium uppercase tracking-widest text-neon-cyan">Diagnostico financeiro</p>
        <h2 className="mt-1 text-lg font-semibold text-white">{perfil.nome}</h2>
        <p className="text-sm text-ice/50">
          {perfil.profissao} · perfil {perfil.perfil_investidor}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <StatPod rotulo="Renda mensal" valor={formatarMoeda(perfil.renda_mensal)} />
          <StatPod rotulo="Patrimonio" valor={formatarMoeda(perfil.patrimonio_total)} />
          <StatPod
            rotulo="Saldo do mes"
            valor={formatarMoeda(resumo.saldoMensal)}
            tom={saldoPositivo ? "emerald" : "red"}
          />
          <StatPod rotulo="Reserva atual" valor={formatarMoeda(perfil.reserva_emergencia_atual)} />
        </div>
      </HoloPanel>

      <HoloPanel acento="emerald">
        <h3 className="text-sm font-semibold text-white">Reserva de emergencia</h3>
        <p className="mt-1 text-xs text-ice/50">
          {formatarMoeda(perfil.reserva_emergencia_atual)} de {formatarMoeda(resumo.reservaEmergenciaAlvo)}
        </p>
        <div className="mt-3">
          <ProgressBeam percentual={resumo.reservaEmergenciaPercentual} cor="emerald" completo={resumo.reservaEmergenciaPercentual >= 100} />
        </div>
        <p className="mt-1 text-right text-xs font-medium text-neon-emerald">
          {resumo.reservaEmergenciaPercentual}%
        </p>
      </HoloPanel>

      <HoloPanel acento="cyan">
        <h3 className="text-sm font-semibold text-white">Metas</h3>
        <ul className="mt-3 flex flex-col gap-3">
          {perfil.metas.map((meta) => (
            <li key={meta.meta} className="text-sm">
              <div className="flex items-center justify-between">
                <span className="text-ice/80">{meta.meta}</span>
                <span className="text-xs text-ice/40">ate {meta.prazo}</span>
              </div>
              <span className="text-xs text-ice/40">{formatarMoeda(meta.valor_necessario)}</span>
            </li>
          ))}
        </ul>
      </HoloPanel>

      <HoloPanel acento="orange">
        <h3 className="text-sm font-semibold text-white">Gastos por categoria</h3>
        <ul className="mt-3 flex flex-col gap-2">
          {resumo.gastosPorCategoria.map((item) => (
            <li key={item.categoria} className="flex items-center justify-between text-sm">
              <span className="capitalize text-ice/70">{item.categoria}</span>
              <span className="font-medium text-white">{formatarMoeda(item.valor)}</span>
            </li>
          ))}
        </ul>
      </HoloPanel>
    </aside>
  );
}
