"use client";

import { useMemo, useState } from "react";
import { GraduationCap } from "lucide-react";

import HoloPanel from "@/components/ui/HoloPanel";
import StatPod from "@/components/ui/StatPod";
import ProgressBeam from "@/components/ui/ProgressBeam";
import ConteudoCard, { TEMA_LABEL, type ConteudoEducacional } from "@/components/educacao/ConteudoCard";
import { useFinanceStore } from "@/store/useFinanceStore";
import { useJourneyPhase } from "@/hooks/useJourneyPhase";
import conteudosSeed from "@/data/conteudos_educacionais.json";

const conteudos = conteudosSeed as ConteudoEducacional[];

export default function EducacaoPage() {
  const { fase } = useJourneyPhase();
  const conteudosLidos = useFinanceStore((s) => s.conteudosLidos);

  const [filtroTema, setFiltroTema] = useState("todos");

  const temas = useMemo(() => Array.from(new Set(conteudos.map((c) => c.tema))), []);
  const idsRecomendados = useMemo(
    () => new Set(conteudos.filter((c) => c.fasesRecomendadas.includes(fase)).map((c) => c.id)),
    [fase],
  );

  const conteudosFiltrados = useMemo(() => {
    const base = filtroTema === "todos" ? conteudos : conteudos.filter((c) => c.tema === filtroTema);
    return [...base].sort((a, b) => {
      const prioridadeA = idsRecomendados.has(a.id) ? 0 : 1;
      const prioridadeB = idsRecomendados.has(b.id) ? 0 : 1;
      return prioridadeA - prioridadeB;
    });
  }, [filtroTema, idsRecomendados]);

  const percentualLido = conteudos.length > 0 ? Math.round((conteudosLidos.length / conteudos.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs uppercase tracking-widest text-neon-emerald">Modulo 4</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Educacao e Filosofia Financeira</h1>
        <p className="mt-1 text-sm text-ice/50">
          Essencialismo, hiperconsumo, sociedade do cansaco e a construcao de um patrimonio que atravessa geracoes.
        </p>
      </div>

      <HoloPanel acento="emerald" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <StatPod
          rotulo="Seu progresso de leitura"
          valor={`${conteudosLidos.length} de ${conteudos.length} conteudos`}
          tom="emerald"
          icone={<GraduationCap size={13} />}
        />
        <div className="w-full sm:w-56">
          <ProgressBeam percentual={percentualLido} cor="emerald" completo={percentualLido >= 100} />
        </div>
      </HoloPanel>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFiltroTema("todos")}
          className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
            filtroTema === "todos" ? "border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan" : "border-white/10 text-ice/50 hover:border-neon-cyan/30"
          }`}
        >
          Todos os temas
        </button>
        {temas.map((tema) => (
          <button
            key={tema}
            type="button"
            onClick={() => setFiltroTema(tema)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
              filtroTema === tema ? "border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan" : "border-white/10 text-ice/50 hover:border-neon-cyan/30"
            }`}
          >
            {TEMA_LABEL[tema] ?? tema}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {conteudosFiltrados.map((conteudo) => (
          <ConteudoCard key={conteudo.id} conteudo={conteudo} destacado={idsRecomendados.has(conteudo.id)} />
        ))}
      </div>
    </div>
  );
}
