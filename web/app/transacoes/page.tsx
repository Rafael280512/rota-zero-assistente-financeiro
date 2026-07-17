import TransacoesGrid from "@/components/transacoes/TransacoesGrid";

export default function TransacoesPage() {
  return (
    <div>
      <div className="mb-4">
        <p className="text-xs uppercase tracking-widest text-neon-cyan">Modulo 3 · Modo Power User</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Motor de Gestao</h1>
        <p className="mt-1 text-sm text-ice/50">
          Edite qualquer celula diretamente na grade, filtre, ordene e categorize em massa.
        </p>
      </div>
      <TransacoesGrid />
    </div>
  );
}
