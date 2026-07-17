"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { PontoProjecao } from "@/hooks/useDashboardData";
import HoloTooltip from "./HoloTooltip";

function formatarMoedaCompacta(valor: number): string {
  if (Math.abs(valor) >= 1000) return `${(valor / 1000).toFixed(0)}k`;
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export default function ProjecaoJurosChart({ dados }: { dados: PontoProjecao[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={dados} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid stroke="rgba(0,255,255,0.08)" vertical={false} />
        <XAxis
          dataKey="ano"
          tickFormatter={(v: number) => `${v}a`}
          tick={{ fill: "rgba(224,247,250,0.4)", fontSize: 11 }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "rgba(224,247,250,0.4)", fontSize: 11 }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
          tickFormatter={(v: number) => formatarMoedaCompacta(v)}
          width={56}
        />
        <Tooltip content={<HoloTooltip formatarValor={formatarMoedaCompacta} />} />
        <Line
          type="monotone"
          dataKey="patrimonioProjetado"
          name="Juros a favor (investindo)"
          stroke="#2ecc71"
          strokeWidth={2.5}
          dot={{ r: 2, fill: "#2ecc71" }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="dividaProjetada"
          name="Juros contra (divida parada)"
          stroke="#ff4b2b"
          strokeWidth={2.5}
          strokeDasharray="5 4"
          dot={{ r: 2, fill: "#ff4b2b" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
