"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { PontoLinhaDoTempo } from "@/utils/debtStrategy";
import HoloTooltip from "./HoloTooltip";

function formatarMoedaCompacta(valor: number): string {
  if (Math.abs(valor) >= 1000) return `${(valor / 1000).toFixed(1)}k`;
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export default function QuitacaoChart({
  bolaDeNeve,
  avalanche,
}: {
  bolaDeNeve: PontoLinhaDoTempo[];
  avalanche: PontoLinhaDoTempo[];
}) {
  const totalMeses = Math.max(bolaDeNeve.at(-1)?.mes ?? 0, avalanche.at(-1)?.mes ?? 0);
  const dados = Array.from({ length: totalMeses + 1 }, (_, mes) => ({
    mes,
    bolaDeNeve: bolaDeNeve.find((p) => p.mes === mes)?.saldoTotal ?? bolaDeNeve.at(-1)?.saldoTotal ?? 0,
    avalanche: avalanche.find((p) => p.mes === mes)?.saldoTotal ?? avalanche.at(-1)?.saldoTotal ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={dados} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid stroke="rgba(0,255,255,0.08)" vertical={false} />
        <XAxis
          dataKey="mes"
          tickFormatter={(v: number) => `${v}m`}
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
        <Line type="monotone" dataKey="bolaDeNeve" name="Bola de neve" stroke="#ff9f43" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="avalanche" name="Avalanche" stroke="#00ffff" strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
