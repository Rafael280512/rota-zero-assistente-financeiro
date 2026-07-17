import type { ReactNode } from "react";

type Tom = "cyan" | "emerald" | "orange" | "red" | "neutro";

const TONS: Record<Tom, string> = {
  cyan: "text-neon-cyan text-glow-cyan",
  emerald: "text-neon-emerald",
  orange: "text-neon-orange",
  red: "text-neon-red",
  neutro: "text-ice",
};

export default function StatPod({
  rotulo,
  valor,
  tom = "neutro",
  icone,
}: {
  rotulo: string;
  valor: ReactNode;
  tom?: Tom;
  icone?: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-ice/50">
        {icone}
        {rotulo}
      </div>
      <p className={`mt-1 text-xl font-semibold tabular-nums ${TONS[tom]}`}>{valor}</p>
    </div>
  );
}
