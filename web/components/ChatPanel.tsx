"use client";

import { useRef, useState } from "react";

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
    <section className="flex h-[calc(100vh-8rem)] min-h-[32rem] flex-col rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-4">
          {mensagens.map((mensagem, indice) => (
            <div
              key={indice}
              className={`flex ${mensagem.autor === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[75%] ${
                  mensagem.autor === "user"
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                }`}
              >
                {mensagem.texto}
              </div>
            </div>
          ))}
          {carregando && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 rounded-2xl bg-zinc-100 px-4 py-3 dark:bg-zinc-800">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
              </div>
            </div>
          )}
          <div ref={fimDoChatRef} />
        </div>
      </div>

      {erro && (
        <p className="mx-4 mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950 dark:text-red-300">
          {erro}
        </p>
      )}

      {!apiKeyConfigurada && (
        <p className="mx-4 mb-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-200">
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
              className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-emerald-700 dark:hover:text-emerald-400"
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
        className="flex items-center gap-2 border-t border-zinc-200 p-3 dark:border-zinc-800 sm:p-4"
      >
        <input
          value={pergunta}
          onChange={(evento) => setPergunta(evento.target.value)}
          placeholder="Escreva sua pergunta para o Rota Zero..."
          className="flex-1 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-emerald-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          disabled={carregando}
        />
        <button
          type="submit"
          disabled={carregando || !pergunta.trim()}
          className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </section>
  );
}
