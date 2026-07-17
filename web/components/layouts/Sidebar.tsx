"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Compass,
  LayoutDashboard,
  HeartPulse,
  Table2,
  TrendingUp,
  GraduationCap,
  Lock,
  type LucideIcon,
} from "lucide-react";

import { useJourneyPhase } from "@/hooks/useJourneyPhase";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  gated?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Assistente", icon: Compass },
  { href: "/dashboard", label: "Central de Comando", icon: LayoutDashboard },
  { href: "/dividas", label: "Ponto Zero", icon: HeartPulse },
  { href: "/transacoes", label: "Transações", icon: Table2 },
  { href: "/investimentos", label: "Investimentos", icon: TrendingUp, gated: true },
  { href: "/educacao", label: "Educação", icon: GraduationCap },
];

function NavLink({ item, ativo, liberado }: { item: NavItem; ativo: boolean; liberado: boolean }) {
  const Icone = item.icon;
  const bloqueado = item.gated && !liberado;

  return (
    <Link
      href={item.href}
      className={`group relative flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors ${
        ativo
          ? "bg-neon-cyan/10 text-neon-cyan"
          : bloqueado
            ? "text-ice/30 hover:text-ice/50"
            : "text-ice/60 hover:bg-white/5 hover:text-ice"
      }`}
    >
      {ativo && (
        <motion.span
          layoutId="nav-ativo"
          className="absolute inset-y-0 left-0 w-0.5 bg-neon-cyan glow-cyan"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
      <Icone size={17} strokeWidth={1.75} />
      <span className="hidden font-medium tracking-wide md:inline">{item.label}</span>
      {bloqueado && <Lock size={12} className="hidden md:ml-auto md:inline" />}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { investimentosLiberados } = useJourneyPhase();

  return (
    <nav className="fixed inset-y-0 left-0 z-20 flex w-16 flex-col gap-1 border-r border-neon-cyan/10 bg-holo-void/70 p-2 pt-20 backdrop-blur-xl md:w-56 md:p-3 md:pt-24">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} item={item} ativo={pathname === item.href} liberado={investimentosLiberados} />
      ))}
    </nav>
  );
}
