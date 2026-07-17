import type { HTMLAttributes, ReactNode } from "react";

type Acento = "cyan" | "emerald" | "orange" | "red";

const ACENTOS: Record<Acento, string> = {
  cyan: "border-l-2 border-l-neon-cyan",
  emerald: "border-l-2 border-l-neon-emerald",
  orange: "border-l-2 border-l-neon-orange",
  red: "border-l-2 border-l-neon-red",
};

interface HoloPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  acento?: Acento;
}

export default function HoloPanel({ children, acento, className = "", ...props }: HoloPanelProps) {
  return (
    <div className={`holo-panel rounded-sm p-5 ${acento ? ACENTOS[acento] : ""} ${className}`} {...props}>
      {children}
    </div>
  );
}
