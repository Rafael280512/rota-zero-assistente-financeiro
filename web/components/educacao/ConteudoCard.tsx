"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronDown, Circle, Clock, Sparkles } from "lucide-react";

import HoloPanel from "@/components/ui/HoloPanel";
import { useFinanceStore } from "@/store/useFinanceStore";
import type { FaseJornada } from "@/hooks/useJourneyPhase";

export interface ConteudoEducacional {
  id: string;
  titulo: string;
  tema: string;
  resumo: string;
  corpo: string;
  tempoLeituraMinutos: number;
  fasesRecomendadas: FaseJornada[];
}

export const TEMA_LABEL: Record<string, string> = {
  essencialismo: "Essencialismo",
  comportamento: "Comportamento",
  hiperconsumo: "Hiperconsumo",
  legado: "Legado familiar",
  matematica_do_dinheiro: "Matematica do dinheiro",
};

export default function ConteudoCard({
  conteudo,
  destacado = false,
}: {
  conteudo: ConteudoEducacional;
  destacado?: boolean;
}) {
  const [expandido, setExpandido] = useState(false);
  const lido = useFinanceStore((s) => s.conteudosLidos.includes(conteudo.id));
  const marcarConteudoLido = useFinanceStore((s) => s.marcarConteudoLido);

  return (
    <HoloPanel acento={destacado ? "cyan" : lido ? "emerald" : undefined}>
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-ice/50">
          {TEMA_LABEL[conteudo.tema] ?? conteudo.tema}
        </span>
        {destacado && (
          <span className="flex items-center gap-1 rounded-full border border-neon-cyan/40 bg-neon-cyan/10 px-2 py-0.5 text-[11px] text-neon-cyan">
            <Sparkles size={11} /> Para sua fase
          </span>
        )}
      </div>

      <h3 className="mt-2 text-base font-semibold text-white">{conteudo.titulo}</h3>
      <p className="mt-1 text-sm text-ice/50">{conteudo.resumo}</p>

      <div className="mt-2 flex items-center gap-1.5 text-xs text-ice/30">
        <Clock size={12} /> {conteudo.tempoLeituraMinutos} min de leitura
      </div>

      {expandido && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 overflow-hidden">
          <div className="flex flex-col gap-3 border-t border-white/10 pt-3 text-sm leading-relaxed text-ice/70">
            {conteudo.corpo.split("\n\n").map((paragrafo, indice) => (
              <p key={indice}>{paragrafo}</p>
            ))}
          </div>
        </motion.div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setExpandido((atual) => !atual)}
          className="flex items-center gap-1 text-xs text-neon-cyan hover:text-neon-cyan/80"
        >
          {expandido ? "Ler menos" : "Ler mais"}
          <ChevronDown size={13} className={`transition-transform ${expandido ? "rotate-180" : ""}`} />
        </button>

        <button
          type="button"
          onClick={() => marcarConteudoLido(conteudo.id, !lido)}
          className={`flex items-center gap-1.5 text-xs ${lido ? "text-neon-emerald" : "text-ice/40 hover:text-ice/70"}`}
        >
          {lido ? <CheckCircle2 size={14} /> : <Circle size={14} />}
          {lido ? "Lido" : "Marcar como lido"}
        </button>
      </div>
    </HoloPanel>
  );
}
