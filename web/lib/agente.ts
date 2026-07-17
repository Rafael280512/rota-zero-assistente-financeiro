import { historicoAtendimento, perfilInvestidor, produtosFinanceiros, transacoes } from "./data";

const SYSTEM_PROMPT_LINES = [
    "Voce e o Rota Zero, um agente financeiro conversacional especializado em ajudar pessoas endividadas a sairem do vermelho e construirem um planejamento financeiro saudavel e sustentavel.",
    "Seu objetivo principal e conduzir cada usuario por tres fases da jornada financeira: Diagnostico, Reconstrucao e Planejamento.",
    "REGRAS:",
    "Sempre baseie suas respostas nos dados de transacoes, historico de atendimento e perfil do investidor. Nunca invente valores fora dos produtos financeiros cadastrados.",
    "Nunca ofereca recomendacao de investimento antes de confirmar que o usuario nao possui dividas em aberto e ja possui reserva de emergencia minima constituida.",
    "Trate o usuario sempre com empatia e sem julgamento. Divida nao e fracasso pessoal, e um problema resolvivel.",
    "Use linguagem simples, acolhedora e direta. Evite jargoes financeiros sem explica-los.",
    "Se nao souber a resposta ou nao tiver o dado necessario, admita isso claramente e ofereca um proximo passo.",
    "Nunca solicite ou compartilhe senhas, dados bancarios completos, numeros de cartao ou documentos de identidade.",
    "Nunca responda perguntas fora do escopo financeiro. Redirecione gentilmente o usuario de volta ao proposito do agente.",
    "Sempre que identificar sinais de sofrimento emocional intenso relacionado a dinheiro, acolha a emocao e recomende buscar apoio profissional quando apropriado.",
    "Estruture respostas longas em passos curtos e acionaveis, nunca em blocos extensos de texto.",
    "Celebre progressos, por menores que sejam. Motivacao sustentada e parte central da sua funcao.",
  ];

export const SYSTEM_PROMPT = SYSTEM_PROMPT_LINES.join("\n");

export type MensagemHistorico = {
    role: "user" | "model";
    parts: { text: string }[];
};

function montarContexto(): string {
    const partes: string[] = [];
    partes.push("PERFIL DO CLIENTE:");
    partes.push(JSON.stringify(perfilInvestidor, null, 2));
    partes.push("PRODUTOS FINANCEIROS DISPONIVEIS:");
    partes.push(JSON.stringify(produtosFinanceiros, null, 2));
    partes.push("ULTIMAS TRANSACOES:");
    partes.push(
          transacoes.map((t) => `${t.data} | ${t.descricao} | ${t.categoria} | ${t.valor} | ${t.tipo}`).join("\n")
        );
    partes.push("HISTORICO DE ATENDIMENTO:");
    partes.push(
          historicoAtendimento
            .map((h) => `${h.data} | ${h.canal} | ${h.tema} | ${h.resumo} | ${h.resolvido}`)
            .join("\n")
        );
    return partes.join("\n\n");
}

export async function perguntar(historico: MensagemHistorico[], pergunta: string) {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
          throw new Error("GOOGLE_API_KEY nao configurada no ambiente.");
    }
    const model = process.env.ROTA_ZERO_MODEL || "gemini-flash-latest";
    const contexto = montarContexto();
    const mensagem = `CONTEXTO DA BASE DE CONHECIMENTO:\n${contexto}\n\nPERGUNTA DO USUARIO:\n${pergunta}`;

  const contents: MensagemHistorico[] = [
        ...historico,
    { role: "user", parts: [{ text: mensagem }] },
      ];

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const resposta = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
                  system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
                  contents,
          }),
    });

  if (!resposta.ok) {
        const textoErro = await resposta.text();
        throw new Error(`Erro na API do Gemini (${resposta.status}): ${textoErro}`);
  }

  const dados = await resposta.json();
    const texto: string =
          dados?.candidates?.[0]?.content?.parts?.map((p: { text: string }) => p.text).join("") || "";

  const novoHistorico: MensagemHistorico[] = [
        ...contents,
    { role: "model", parts: [{ text: texto }] },
      ];

  return { resposta: texto, historico: novoHistorico };
}
