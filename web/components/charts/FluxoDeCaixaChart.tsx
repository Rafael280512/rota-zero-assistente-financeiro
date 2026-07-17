"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { PontoFluxo } from "@/hooks/useDashboardData";
import HoloTooltip from "./HoloTooltip";

function formatarMoedaCompacta(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export default function FluxoDeCaixaChart({ dados }: { dados: PontoFluxo[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={dados} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="fluxoGradiente" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00ffff" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#1565c0" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(0,255,255,0.08)" vertical={false} />
        <XAxis dataKey="data" tick={{ fill: "rgba(224,247,250,0.4)", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} tickLine={false} />
        <YAxis
          tick={{ fill: "rgba(224,247,250,0.4)", fontSize: 11 }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
          tickFormatter={(v: number) => formatarMoedaCompacta(v)}
          width={64}
        />
        <Tooltip content={<HoloTooltip formatarValor={formatarMoedaCompacta} />} />
        <Area
          type="monotone"
          dataKey="saldoAcumulado"
          name="Saldo acumulado"
          stroke="#00ffff"
          strokeWidth={2}
          fill="url(#fluxoGradiente)"
          activeDot={{ r: 4, fill: "#00ffff", stroke: "#00030a", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
