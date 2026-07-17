"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

import type { Divida } from "@/store/useFinanceStore";
import HoloPanel from "@/components/ui/HoloPanel";

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function PainelVitorias({ dividasQuitadas }: { dividasQuitadas: Divida[] }) {
  return (
    <HoloPanel acento="emerald">
      <div className="flex items-center gap-2">
        <Trophy size={16} className="text-neon-emerald" />
        <h3 className="text-sm font-semibold text-white">Painel de Vitorias</h3>
      </div>

      {dividasQuitadas.length === 0 ? (
        <p className="mt-3 text-sm text-ice/40">
          Nenhuma divida quitada ainda. Registre um pagamento e sua primeira vitoria aparece aqui.
        </p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {dividasQuitadas.map((divida) => (
            <motion.li
              key={divida.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-between rounded-sm border border-neon-emerald/30 bg-neon-emerald/10 px-3 py-2 text-sm"
            >
              <span className="flex items-center gap-2 text-neon-emerald">
                <Trophy size={14} /> {divida.credor}
              </span>
              <span className="text-xs text-ice/50">quitada · {formatarMoeda(divida.valorOriginal)}</span>
            </motion.li>
          ))}
        </ul>
      )}
    </HoloPanel>
  );
}
