import type { Perfil, Resumo } from "@/lib/data";

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function ProgressBar({ percentual }: { percentual: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-emerald-100 dark:bg-emerald-950">
      <div
        className="h-2 rounded-full bg-emerald-500 transition-all"
        style={{ width: `${Math.max(4, percentual)}%` }}
      />
    </div>
  );
}

export default function Dashboard({ perfil, resumo }: { perfil: Perfil; resumo: Resumo }) {
  const saldoPositivo = resumo.saldoMensal >= 0;

  return (
    <aside className="flex flex-col gap-4">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
          Diagnostico financeiro
        </p>
        <h2 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">{perfil.nome}</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {perfil.profissao} · perfil {perfil.perfil_investidor}
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-zinc-500 dark:text-zinc-400">Renda mensal</dt>
            <dd className="font-semibold text-zinc-900 dark:text-zinc-50">{formatarMoeda(perfil.renda_mensal)}</dd>
          </div>
          <div>
            <dt className="text-zinc-500 dark:text-zinc-400">Patrimonio</dt>
            <dd className="font-semibold text-zinc-900 dark:text-zinc-50">{formatarMoeda(perfil.patrimonio_total)}</dd>
          </div>
          <div>
            <dt className="text-zinc-500 dark:text-zinc-400">Saldo do mes</dt>
            <dd className={`font-semibold ${saldoPositivo ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
              {formatarMoeda(resumo.saldoMensal)}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500 dark:text-zinc-400">Reserva atual</dt>
            <dd className="font-semibold text-zinc-900 dark:text-zinc-50">{formatarMoeda(perfil.reserva_emergencia_atual)}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Reserva de emergencia</h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {formatarMoeda(perfil.reserva_emergencia_atual)} de {formatarMoeda(resumo.reservaEmergenciaAlvo)}
        </p>
        <div className="mt-2">
          <ProgressBar percentual={resumo.reservaEmergenciaPercentual} />
        </div>
        <p className="mt-1 text-right text-xs font-medium text-emerald-600 dark:text-emerald-400">
          {resumo.reservaEmergenciaPercentual}%
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Metas</h3>
        <ul className="mt-3 flex flex-col gap-3">
          {perfil.metas.map((meta) => (
            <li key={meta.meta} className="text-sm">
              <div className="flex items-center justify-between">
                <span className="text-zinc-700 dark:text-zinc-300">{meta.meta}</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">ate {meta.prazo}</span>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{formatarMoeda(meta.valor_necessario)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Gastos por categoria</h3>
        <ul className="mt-3 flex flex-col gap-2">
          {resumo.gastosPorCategoria.map((item) => (
            <li key={item.categoria} className="flex items-center justify-between text-sm">
              <span className="capitalize text-zinc-700 dark:text-zinc-300">{item.categoria}</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-50">{formatarMoeda(item.valor)}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
