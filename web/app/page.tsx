"use client";

import { createElement as h, useState, useEffect, useRef } from "react";

type Mensagem = { autor: "user" | "assistant"; texto: string };
type Gasto = { categoria: string; valor: number };
type Meta = { nome: string; alvo: number; atual: number };
type Perfil = {
      nome?: string;
      rendaMensal?: number;
      temDividas?: boolean;
      totalDividas?: number;
      gastos?: Gasto[];
      metas?: Meta[];
      fase?: string;
};
type ItemHistorico = { role: string; parts: { text: string }[] };

const CORES = ["#00E28A", "#D4AF37", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#14B8A6"];
const K_PERFIL = "rotazero_perfil";
const K_MSG = "rotazero_mensagens";
const K_HIST = "rotazero_historico";

function fmt(v: number) {
      return "R$ " + (v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function Home() {
      const [mensagens, setMensagens] = useState<Mensagem[]>([]);
      const [historico, setHistorico] = useState<ItemHistorico[]>([]);
      const [perfil, setPerfil] = useState<Perfil | null>(null);
      const [pergunta, setPergunta] = useState("");
      const [carregando, setCarregando] = useState(false);
      const [erro, setErro] = useState("");
      const [pronto, setPronto] = useState(false);
      const fimRef = useRef<HTMLDivElement>(null);

  useEffect(function () {
          try {
                    const p = localStorage.getItem(K_PERFIL);
                    const m = localStorage.getItem(K_MSG);
                    const hi = localStorage.getItem(K_HIST);
                    if (p) setPerfil(JSON.parse(p));
                    if (m) setMensagens(JSON.parse(m));
                    if (hi) setHistorico(JSON.parse(hi));
          } catch (e) {}
          setPronto(true);
  }, []);

  useEffect(function () {
          if (pronto) localStorage.setItem(K_MSG, JSON.stringify(mensagens));
  }, [mensagens, pronto]);
      useEffect(function () {
              if (pronto) localStorage.setItem(K_HIST, JSON.stringify(historico));
      }, [historico, pronto]);
      useEffect(function () {
              if (pronto && perfil) localStorage.setItem(K_PERFIL, JSON.stringify(perfil));
      }, [perfil, pronto]);
      useEffect(function () {
              if (fimRef.current) fimRef.current.scrollIntoView({ behavior: "smooth" });
      }, [mensagens, carregando]);

  async function enviarTexto(texto: string) {
          const t = texto.trim();
          if (!t || carregando) return;
          setErro("");
          setPergunta("");
          setMensagens(function (m) { return [...m, { autor: "user", texto: t }]; });
          setCarregando(true);
          try {
                    const res = await fetch("/api/chat", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ pergunta: t, historico: historico, perfil: perfil }),
                    });
                    const dados = await res.json();
                    if (!res.ok) throw new Error(dados.error || "Erro ao consultar o Rota Zero.");
                    setMensagens(function (m) { return [...m, { autor: "assistant", texto: dados.resposta }]; });
                    if (Array.isArray(dados.historico)) setHistorico(dados.historico);
                    if (dados.perfil) setPerfil(function (ant) { return { ...(ant || {}), ...dados.perfil }; });
          } catch (e: any) {
                    setErro(e?.message || "Erro inesperado. Tente novamente.");
          } finally {
                    setCarregando(false);
          }
  }

  async function iniciar() {
          if (carregando) return;
          setCarregando(true);
          setErro("");
          try {
                    const res = await fetch("/api/chat", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ pergunta: "Ola", historico: [], perfil: null }),
                    });
                    const dados = await res.json();
                    if (!res.ok) throw new Error(dados.error || "Erro ao iniciar.");
                    setMensagens([{ autor: "assistant", texto: dados.resposta }]);
                    if (Array.isArray(dados.historico)) setHistorico(dados.historico);
                    if (dados.perfil) setPerfil(dados.perfil);
          } catch (e: any) {
                    setErro(e?.message || "Erro ao iniciar.");
          } finally {
                    setCarregando(false);
          }
  }

  function reiniciar() {
          localStorage.removeItem(K_PERFIL);
          localStorage.removeItem(K_MSG);
          localStorage.removeItem(K_HIST);
          setPerfil(null);
          setMensagens([]);
          setHistorico([]);
          setErro("");
  }

  const temPerfil = perfil && (perfil.nome || perfil.rendaMensal || (perfil.gastos && perfil.gastos.length) || (perfil.metas && perfil.metas.length));
      const gastos = (perfil && perfil.gastos ? perfil.gastos : []).filter(function (g) { return g && g.valor > 0; });
      const totalGastos = gastos.reduce(function (s, g) { return s + (g.valor || 0); }, 0);
      const metas = (perfil && perfil.metas ? perfil.metas : []).filter(function (m) { return m && m.alvo > 0; });

  function Pizza() {
          if (!gastos.length) return null;
          const raio = 70, cx = 80, cy = 80;
          let ang = -Math.PI / 2;
          const fatias = gastos.map(function (g, i) {
                    const frac = g.valor / totalGastos;
                    const a2 = ang + frac * Math.PI * 2;
                    const x1 = cx + raio * Math.cos(ang), y1 = cy + raio * Math.sin(ang);
                    const x2 = cx + raio * Math.cos(a2), y2 = cy + raio * Math.sin(a2);
                    const largo = frac > 0.5 ? 1 : 0;
                    const d = "M " + cx + " " + cy + " L " + x1 + " " + y1 + " A " + raio + " " + raio + " 0 " + largo + " 1 " + x2 + " " + y2 + " Z";
                    ang = a2;
                    return h("path", { key: i, d: d, fill: CORES[i % CORES.length], stroke: "#0d1117", strokeWidth: 1 });
          });
          return h("svg", { width: 160, height: 160, viewBox: "0 0 160 160" }, fatias);
  }

  function md(texto: string) {
          const partes = texto.split(/(\*\*[^*]+\*\*)/g);
          return partes.map(function (p, i) {
                    if (p.startsWith("**") && p.endsWith("**")) return h("strong", { key: i, style: { color: "#00E28A" } }, p.slice(2, -2));
                    return p;
          });
  }

  const bolhas = mensagens.map(function (m, i) {
          const ehUser = m.autor === "user";
          return h("div", { key: i, style: { display: "flex", justifyContent: ehUser ? "flex-end" : "flex-start", marginBottom: 14 } },
                         h("div", {
                                     style: {
                                                   maxWidth: "80%", padding: "12px 16px", borderRadius: 14, lineHeight: 1.55, whiteSpace: "pre-wrap", fontSize: 15,
                                                   background: ehUser ? "#00E28A" : "#161b22", color: ehUser ? "#03110a" : "#e6edf3",
                                                   border: ehUser ? "none" : "1px solid #21262d", fontWeight: ehUser ? 600 : 400,
                                     },
                         }, m.texto.split("\n").map(function (linha, j) { return h("div", { key: j }, md(linha)); }))
                       );
  });

  const painelDados: any[] = [];
      painelDados.push(h("h3", { key: "t", style: { margin: "0 0 4px", fontSize: 13, letterSpacing: 1, textTransform: "uppercase", color: "#8b949e" } }, "Seu Painel"));
      if (perfil && perfil.nome) painelDados.push(h("div", { key: "nome", style: { fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 16 } }, perfil.nome));
      if (perfil && perfil.rendaMensal) painelDados.push(cardInfo("card-renda", "Renda mensal", fmt(perfil.rendaMensal), "#00E28A"));
      if (perfil && perfil.temDividas) painelDados.push(cardInfo("card-div", "Dividas", fmt(perfil.totalDividas || 0), "#EF4444"));
      if (perfil && perfil.temDividas === false) painelDados.push(cardInfo("card-semdiv", "Dividas", "Sem dividas", "#00E28A"));

  function cardInfo(k: string, rotulo: string, valor: string, cor: string) {
          return h("div", { key: k, style: { background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: "12px 14px", marginBottom: 10 } },
                         h("div", { style: { fontSize: 12, color: "#8b949e", marginBottom: 4 } }, rotulo),
                         h("div", { style: { fontSize: 20, fontWeight: 700, color: cor } }, valor)
                       );
  }

  if (gastos.length) {
          const legenda = gastos.map(function (g, i) {
                    return h("div", { key: i, style: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, marginBottom: 4 } },
                                     h("span", { style: { width: 10, height: 10, borderRadius: 3, background: CORES[i % CORES.length], display: "inline-block" } }),
                                     h("span", { style: { color: "#c9d1d9", flex: 1 } }, g.categoria),
                                     h("span", { style: { color: "#8b949e" } }, fmt(g.valor))
                                   );
          });
          painelDados.push(h("div", { key: "gastos", style: { background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 14, marginBottom: 10 } },
                                   h("div", { style: { fontSize: 13, fontWeight: 600, color: "#c9d1d9", marginBottom: 10 } }, "Distribuicao de gastos"),
                                   h("div", { style: { display: "flex", justifyContent: "center", marginBottom: 10 } }, h(Pizza, null)),
                                   legenda
                                 ));
  }

  if (metas.length) {
          const barras = metas.map(function (mt, i) {
                    const pct = Math.min(100, Math.round((mt.atual / mt.alvo) * 100));
                    return h("div", { key: i, style: { marginBottom: 12 } },
                                     h("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 13, color: "#c9d1d9", marginBottom: 4 } },
                                                 h("span", null, mt.nome), h("span", { style: { color: "#D4AF37" } }, pct + "%")),
                                     h("div", { style: { height: 8, background: "#0d1117", borderRadius: 6, overflow: "hidden" } },
                                                 h("div", { style: { width: pct + "%", height: "100%", background: "linear-gradient(90deg,#00E28A,#D4AF37)" } })),
                                     h("div", { style: { fontSize: 11, color: "#8b949e", marginTop: 3 } }, fmt(mt.atual) + " de " + fmt(mt.alvo))
                                   );
          });
          painelDados.push(h("div", { key: "metas", style: { background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 14, marginBottom: 10 } },
                                   h("div", { style: { fontSize: 13, fontWeight: 600, color: "#c9d1d9", marginBottom: 12 } }, "Suas metas"),
                                   barras
                                 ));
  }

  const sugestoes = ["Quero organizar minhas dividas", "Como montar minha reserva?", "Onde posso investir?"];

  const areaChat = h("div", { style: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 } },
                         h("div", { style: { flex: 1, overflowY: "auto", padding: "24px 28px" } },
                                 mensagens.length === 0
                                   ? h("div", { style: { textAlign: "center", marginTop: 60, color: "#8b949e" } },
                                                   h("div", { style: { fontSize: 48, marginBottom: 12 } }, "\uD83E\uDDED"),
                                                   h("h2", { style: { color: "#fff", fontWeight: 700, marginBottom: 8 } }, "Bem-vindo ao Rota Zero"),
                                                   h("p", { style: { maxWidth: 420, margin: "0 auto 20px", lineHeight: 1.5 } }, "Seu guia para sair do vermelho e construir um futuro financeiro saudavel. Vamos comecar?"),
                                                   h("button", { onClick: iniciar, disabled: carregando, style: btnPrimario }, carregando ? "Iniciando..." : "Comecar conversa")
                                                 )
                                   : bolhas,
                                 carregando && mensagens.length > 0 ? h("div", { style: { color: "#8b949e", fontSize: 14, fontStyle: "italic" } }, "Rota Zero esta digitando...") : null,
                                 erro ? h("div", { style: { color: "#EF4444", background: "#2d1214", border: "1px solid #EF4444", borderRadius: 8, padding: "10px 14px", fontSize: 14 } }, erro) : null,
                                 h("div", { ref: fimRef })
                               ),
                         mensagens.length > 0 ? h("div", { style: { display: "flex", gap: 8, padding: "0 28px 8px", flexWrap: "wrap" } },
                                                        sugestoes.map(function (s, i) {
                                                                    return h("button", { key: i, onClick: function () { enviarTexto(s); }, disabled: carregando, style: btnChip }, s);
                                                        })
                                                      ) : null,
                         h("form", { onSubmit: function (e: any) { e.preventDefault(); enviarTexto(pergunta); }, style: { display: "flex", gap: 10, padding: "16px 28px 22px", borderTop: "1px solid #21262d" } },
                                 h("input", {
                                             value: pergunta,
                                             onChange: function (e: any) { setPergunta(e.target.value); },
                                             placeholder: "Escreva sua mensagem para o Rota Zero...",
                                             disabled: carregando,
                                             style: { flex: 1, padding: "13px 16px", borderRadius: 10, border: "1px solid #30363d", background: "#0d1117", color: "#e6edf3", fontSize: 15, outline: "none" },
                                 }),
                                 h("button", { type: "submit", disabled: carregando || !pergunta.trim(), style: btnPrimario }, "Enviar")
                               )
                       );

  const painel = h("aside", { style: { width: 320, borderLeft: "1px solid #21262d", padding: 22, overflowY: "auto", background: "#0b0f14" } },
                       temPerfil ? painelDados : h("div", { style: { color: "#8b949e", fontSize: 14, lineHeight: 1.6 } },
                                                         h("h3", { style: { fontSize: 13, letterSpacing: 1, textTransform: "uppercase", color: "#8b949e", marginTop: 0 } }, "Seu Painel"),
                                                         h("p", null, "Conforme voce conversa, seus dados financeiros aparecem aqui: renda, dividas, gastos e metas."),
                                                       ),
                       temPerfil ? h("button", { onClick: reiniciar, style: { ...btnChip, marginTop: 8, width: "100%", borderColor: "#EF4444", color: "#EF4444" } }, "Reiniciar meus dados") : null
                     );

  return h("main", { style: { display: "flex", flexDirection: "column", height: "100vh", background: "#0d1117", color: "#e6edf3", fontFamily: "Inter, system-ui, sans-serif" } },
               h("header", { style: { display: "flex", alignItems: "center", gap: 12, padding: "16px 28px", borderBottom: "1px solid #21262d", background: "#0b0f14" } },
                       h("div", { style: { width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#00E28A,#D4AF37)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#03110a" } }, "R0"),
                       h("div", null,
                                 h("div", { style: { fontWeight: 700, fontSize: 18, color: "#fff" } }, "Rota Zero"),
                                 h("div", { style: { fontSize: 12, color: "#8b949e" } }, "Assistente Financeiro Inteligente")
                               )
                     ),
               h("div", { style: { flex: 1, display: "flex", minHeight: 0 } }, areaChat, painel)
             );
}

const btnPrimario: any = { padding: "13px 22px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#00E28A,#00b86f)", color: "#03110a", fontWeight: 700, fontSize: 15, cursor: "pointer" };
const btnChip: any = { padding: "8px 14px", borderRadius: 20, border: "1px solid #30363d", background: "transparent", color: "#c9d1d9", fontSize: 13, cursor: "pointer" };
