import HoloPanel from "@/components/ui/HoloPanel";

export default function DashboardPage() {
  return (
    <HoloPanel acento="cyan" className="mx-auto max-w-xl text-center">
      <p className="text-xs uppercase tracking-widest text-neon-cyan">Modulo 1</p>
      <h1 className="mt-2 text-2xl font-semibold text-white">Central de Comando</h1>
      <p className="mt-2 text-sm text-ice/60">
        Visao macro do patrimonio, projecoes de juros compostos e alertas de orcamento. Chega no proximo passo.
      </p>
    </HoloPanel>
  );
}
