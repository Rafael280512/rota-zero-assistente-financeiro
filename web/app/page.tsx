import Dashboard from "@/components/Dashboard";
import ChatPanel from "@/components/ChatPanel";
import { carregarPerfil, montarResumoFinanceiro } from "@/lib/data";

export default function Home() {
  const perfil = carregarPerfil();
  const resumo = montarResumoFinanceiro();
  const apiKeyConfigurada = Boolean(process.env.GOOGLE_API_KEY);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
        <Dashboard perfil={perfil} resumo={resumo} />
        <ChatPanel apiKeyConfigurada={apiKeyConfigurada} nomeCliente={perfil.nome} />
      </div>
      <p className="mt-4 text-center text-[11px] text-ice/30">
        O Rota Zero e um agente educativo e nao substitui um profissional certificado.
      </p>
    </div>
  );
}
