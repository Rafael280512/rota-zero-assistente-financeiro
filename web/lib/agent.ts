import { GoogleGenerativeAI } from "@google/generative-ai";
import { montarContexto } from "./data";

const SYSTEM_PROMPT_LINES = [
  "Voce e o Rota Zero, um agente financeiro conversacional especializado em ajudar pessoas endividadas a sairem do vermelho e construirem um planejamento financeiro saudavel e sustentavel.",
  "Seu objetivo principal e conduzir cada usuario por tres fases da jornada financeira: Diagnostico, Reconstrucao e Planejamento.",
  "REGRAS:",
  "Sempre baseie suas respostas nos dados de transacoes, historico de atendimento e perfil do investidor. Nunca invente valores fora dos produtos financeiros fornecidos.",
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

const SYSTEM_PROMPT = SYSTEM_PROMPT_LINES.join("\n");

export const MODEL_NAME = process.env.ROTA_ZERO_MODEL || "gemini-flash-latest";

export interface Turno {
  autor: "user" | "model";
  texto: string;
}

export async function perguntar(historico: Turno[], pergunta: string): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY nao configurada.");
  }

  const contexto = montarContexto();
  const genAI = new GoogleGenerativeAI(apiKey);
  const modelo = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: `${SYSTEM_PROMPT}\n\nCONTEXTO DA BASE DE CONHECIMENTO:\n${contexto}`,
  });

  const chat = modelo.startChat({
    history: historico.map((turno) => ({
      role: turno.autor,
      parts: [{ text: turno.texto }],
    })),
  });

  const resposta = await chat.sendMessage(pergunta);
  return resposta.response.text();
}
