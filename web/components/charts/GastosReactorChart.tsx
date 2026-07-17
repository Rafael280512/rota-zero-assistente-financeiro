"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { FatiaGasto } from "@/hooks/useDashboardData";
import HoloTooltip from "./HoloTooltip";

const CORES = ["#00ffff", "#1565c0", "#2ecc71", "#ff9f43", "#ff4b2b"];

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function GastosReactorChart({ dados }: { dados: FatiaGasto[] }) {
  const total = dados.reduce((soma, item) => soma + item.valor, 0);

  return (
    <div>
      <div className="relative flex items-center justify-center">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 animate-[spin_18s_linear_infinite] rounded-full border border-neon-cyan/20" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 animate-[spin_26s_linear_infinite_reverse] rounded-full border border-dashed border-neon-cyan/10" />

        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Tooltip content={<HoloTooltip formatarValor={formatarMoeda} />} />
            <Pie data={dados} dataKey="valor" nameKey="categoria" innerRadius={55} outerRadius={85} paddingAngle={3} stroke="none">
              {dados.map((_, indice) => (
                <Cell key={indice} fill={CORES[indice % CORES.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <p className="text-[10px] uppercase tracking-widest text-ice/40">Total gasto</p>
          <p className="text-lg font-semibold text-white">{formatarMoeda(total)}</p>
        </div>
      </div>

      <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-ice/60">
        {dados.map((item, indice) => (
          <li key={item.categoria} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CORES[indice % CORES.length] }} />
            <span className="capitalize">{item.categoria}</span>
            <span className="text-ice/30">{total > 0 ? Math.round((item.valor / total) * 100) : 0}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
