"use client";

import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variante = "cyan" | "emerald" | "ghost";

const VARIANTES: Record<Variante, string> = {
  cyan: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/50 hover:bg-neon-cyan/20 hover:shadow-[0_0_18px_rgba(0,255,255,0.45)]",
  emerald:
    "bg-neon-emerald/10 text-neon-emerald border-neon-emerald/50 hover:bg-neon-emerald/20 hover:shadow-[0_0_18px_rgba(46,204,113,0.45)]",
  ghost: "bg-white/5 text-ice border-white/15 hover:bg-white/10",
};

type ButtonPropsSemConflito = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration"
>;

interface NeonButtonProps extends ButtonPropsSemConflito {
  children: ReactNode;
  variante?: Variante;
}

export default function NeonButton({ children, variante = "cyan", className = "", ...props }: NeonButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: props.disabled ? 1 : 1.03 }}
      whileTap={{ scale: props.disabled ? 1 : 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`rounded-sm border px-4 py-2 text-sm font-medium tracking-wide backdrop-blur-md transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${VARIANTES[variante]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
