import Dashboard from "@/components/Dashboard";
import ChatPanel from "@/components/ChatPanel";
import { carregarPerfil, montarResumoFinanceiro } from "@/lib/data";

export default function Home() {
  const perfil = carregarPerfil();
  const resumo = montarResumoFinanceiro();
  const apiKeyConfigurada = Boolean(process.env.GOOGLE_API_KEY);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧭</span>
            <div>
              <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Rota Zero</h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Assistente financeiro inteligente</p>
            </div>
          </div>
          <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 sm:inline-block">
            Diagnostico · Reconstrucao · Planejamento
          </span>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[340px_1fr]">
        <Dashboard perfil={perfil} resumo={resumo} />
        <ChatPanel apiKeyConfigurada={apiKeyConfigurada} nomeCliente={perfil.nome} />
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-6 text-center text-xs text-zinc-400 sm:px-6">
        O Rota Zero e um agente educativo e nao substitui um profissional certificado.
      </footer>
    </div>
  );
}
