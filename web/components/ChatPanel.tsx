"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

import NeonButton from "@/components/ui/NeonButton";

interface Mensagem {
  autor: "user" | "model";
  texto: string;
}

const SUGESTOES = [
  "Como esta minha situacao financeira hoje?",
  "Por onde eu comeco a sair do vermelho?",
  "Quanto falta para completar minha reserva de emergencia?",
  "Ja posso pensar em investir?",
];

export default function ChatPanel({
  apiKeyConfigurada,
  nomeCliente,
}: {
  apiKeyConfigurada: boolean;
  nomeCliente: string;
}) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      autor: "model",
      texto: `Oi, ${nomeCliente.split(" ")[0]}! Eu sou o Rota Zero. Estou aqui para te ajudar a sair do vermelho e construir um planejamento financeiro saudavel, um passo de cada vez. Como posso te ajudar hoje?`,
    },
  ]);
  const [pergunta, setPergunta] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const fimDoChatRef = useRef<HTMLDivElement>(null);

  async function enviarPergunta(texto: string) {
    const perguntaLimpa = texto.trim();
    if (!perguntaLimpa || carregando) return;

    setErro(null);
    const historicoAnterior = mensagens;
    const proximasMensagens: Mensagem[] = [...historicoAnterior, { autor: "user", texto: perguntaLimpa }];
    setMensagens(proximasMensagens);
    setPergunta("");
    setCarregando(true);

    try {
      const resposta = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pergunta: perguntaLimpa,
          historico: historicoAnterior.map((m) => ({ autor: m.autor, texto: m.texto })),
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro ?? "Algo deu errado ao falar com o Rota Zero.");
        return;
      }

      setMensagens((atual) => [...atual, { autor: "model", texto: dados.resposta }]);
      requestAnimationFrame(() => fimDoChatRef.current?.scrollIntoView({ behavior: "smooth" }));
    } catch {
      setErro("Nao foi possivel conectar ao servidor. Verifique sua conexao e tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section className="holo-panel flex h-[calc(100vh-8rem)] min-h-[32rem] flex-col rounded-sm">
      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-4">
          {mensagens.map((mensagem, indice) => (
            <motion.div
              key={indice}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex ${mensagem.autor === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-sm px-4 py-2.5 text-sm leading-relaxed sm:max-w-[75%] ${
                  mensagem.autor === "user"
                    ? "bg-neon-cyan/15 text-ice border border-neon-cyan/30"
                    : "bg-white/5 text-ice/85 border border-white/10"
                }`}
              >
                {mensagem.texto}
              </div>
            </motion.div>
          ))}
          {carregando && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 rounded-sm border border-white/10 bg-white/5 px-4 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neon-cyan [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neon-cyan [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neon-cyan" />
              </div>
            </div>
          )}
          <div ref={fimDoChatRef} />
        </div>
      </div>

      {erro && (
        <p className="mx-4 mb-2 rounded-sm border border-neon-red/30 bg-neon-red/10 px-3 py-2 text-xs text-neon-red">
          {erro}
        </p>
      )}

      {!apiKeyConfigurada && (
        <p className="mx-4 mb-2 rounded-sm border border-neon-orange/30 bg-neon-orange/10 px-3 py-2 text-xs text-neon-orange">
          Configure a variavel <code>GOOGLE_API_KEY</code> em <code>web/.env.local</code> para conversar com o Rota
          Zero (veja o <code>.env.example</code>).
        </p>
      )}

      {mensagens.length <= 1 && (
        <div className="flex flex-wrap gap-2 px-4 pb-2 sm:px-6">
          {SUGESTOES.map((sugestao) => (
            <button
              key={sugestao}
              type="button"
              onClick={() => enviarPergunta(sugestao)}
              className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-ice/60 transition hover:border-neon-cyan/40 hover:text-neon-cyan"
            >
              {sugestao}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(evento) => {
          evento.preventDefault();
          enviarPergunta(pergunta);
        }}
        className="flex items-center gap-2 border-t border-white/10 p-3 sm:p-4"
      >
        <input
          value={pergunta}
          onChange={(evento) => setPergunta(evento.target.value)}
          placeholder="Escreva sua pergunta para o Rota Zero..."
          className="flex-1 rounded-sm border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ice outline-none placeholder:text-ice/30 focus:border-neon-cyan/50"
          disabled={carregando}
        />
        <NeonButton type="submit" disabled={carregando || !pergunta.trim()}>
          Enviar
        </NeonButton>
      </form>
    </section>
  );
}
