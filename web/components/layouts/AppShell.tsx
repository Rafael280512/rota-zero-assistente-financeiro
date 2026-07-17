"use client";

import type { ReactNode } from "react";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import PageTransition from "./PageTransition";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="holo-grid-bg pointer-events-none fixed inset-0 opacity-60" />
      <div className="holo-scanlines pointer-events-none fixed inset-0 opacity-40" />

      <TopBar />
      <Sidebar />

      <main className="relative z-10 min-h-screen pt-16 pl-16 md:pl-56">
        <div className="p-4 sm:p-6">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
    </div>
  );
}
