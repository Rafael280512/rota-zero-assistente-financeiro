"use client";

import { motion } from "framer-motion";

type Cor = "cyan" | "emerald" | "orange" | "red";

const CORES: Record<Cor, string> = {
  cyan: "bg-gradient-to-r from-neon-blue to-neon-cyan shadow-[0_0_12px_rgba(0,255,255,0.6)]",
  emerald: "bg-gradient-to-r from-emerald-700 to-neon-emerald shadow-[0_0_12px_rgba(46,204,113,0.6)]",
  orange: "bg-gradient-to-r from-orange-700 to-neon-orange shadow-[0_0_12px_rgba(255,159,67,0.6)]",
  red: "bg-gradient-to-r from-red-800 to-neon-red shadow-[0_0_12px_rgba(255,75,43,0.6)]",
};

export default function ProgressBeam({
  percentual,
  cor = "cyan",
  completo = false,
}: {
  percentual: number;
  cor?: Cor;
  completo?: boolean;
}) {
  const largura = Math.max(2, Math.min(100, percentual));

  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
      <motion.div
        className={`h-1.5 rounded-full ${CORES[cor]} ${completo ? "animate-pulse-glow" : ""}`}
        initial={{ width: 0 }}
        animate={{ width: `${largura}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
}
