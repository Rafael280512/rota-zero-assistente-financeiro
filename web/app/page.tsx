"use client";

import { createElement as h, useState, type FormEvent, type ChangeEvent } from "react";

type Mensagem = { autor: "user" | "assistant"; texto: string };
type ParteHistorico = { text: string };
type ItemHistorico = { role: string; parts: ParteHistorico[] };

export default function Home() {
    const [mensagens, setMensagens] = useState<Mensagem[]>([]);
    const [historico, setHistorico] = useState<ItemHistorico[]>([]);
    const [pergunta, setPergunta] = useState("");
    const [carregando, setCarregando] = useState(false);

  async function enviar(e: FormEvent) {
        e.preventDefault();
        if (!pergunta.trim()) return;
        const perguntaAtual = pergunta;
        setMensagens((m) => [...m, { autor: "user", texto: perguntaAtual }]);
        setPergunta("");
        setCarregando(true);
        try {
                const res = await fetch("/api/chat", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ pergunta: perguntaAtual, historico }),
                });
                const dados = await res.json();
                if (!res.ok) {
                          throw new Error(dados.error || "Erro ao consultar o Rota Zero.");
                }
                setHistorico(dados.historico);
                setMensagens((m) => [...m, { autor: "assistant", texto: dados.resposta }]);
        } catch (err) {
                const mensagemErro = err instanceof Error ? err.message : "Erro desconhecido.";
                setMensagens((m) => [...m, { autor: "assistant", texto: `Erro: ${mensagemErro}` }]);
        } finally {
                setCarregando(false);
        }
  }

  const listaMensagens = mensagens.map((m, i) =>
        h(
                "div",
          {
                    key: i,
                    style: {
                                alignSelf: m.autor === "user" ? "flex-end" : "flex-start",
                                background: m.autor === "user" ? "#DCF2FF" : "#F1F1F1",
                                padding: "8px 12px",
                                borderRadius: 8,
                                maxWidth: "80%",
                    },
          },
                m.texto
              )
                                         );

  return h(
        "main",
    { style: { display: "flex", minHeight: "100vh" } },
        h(
                "aside",
          { style: { width: 260, padding: 24, borderRight: "1px solid #eee" } },
                h("h2", null, "Sobre o Rota Zero"),
                h(
                          "p",
                          null,
                          "Assistente educativo para ajudar pessoas endividadas a sairem do vermelho e planejarem investimentos saudaveis."
                        )
              ),
        h(
                "section",
          { style: { flex: 1, display: "flex", flexDirection: "column", padding: 24, maxWidth: 720 } },
                h("h1", null, "Rota Zero - Assistente Financeiro"),
                h(
                          "p",
                  { style: { color: "#666" } },
                          "Prototipo do Lab DIO: Construa seu Assistente Virtual com Inteligencia Artificial"
                        ),
                h(
                          "div",
                  {
                              style: {
                                            flex: 1,
                                            overflowY: "auto",
                                            margin: "16px 0",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 12,
                              },
                  },
                          ...listaMensagens,
                          carregando ? h("div", { key: "loading" }, "Rota Zero esta pensando...") : null
                        ),
                h(
                          "form",
                  { onSubmit: enviar, style: { display: "flex", gap: 8 } },
                          h("input", {
                                      value: pergunta,
                                                onChange: (e: ChangeEvent<HTMLInputElement>) => setPergunta(e.target.value),
                                      placeholder: "Escreva sua pergunta para o Rota Zero...",
                                      style: { flex: 1, padding: 8 },
                          }),
                          h("button", { type: "submit", disabled: carregando }, "Enviar")
                        )
              )
      );
}
