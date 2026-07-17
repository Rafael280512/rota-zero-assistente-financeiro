import { NextResponse } from "next/server";
import { perguntar, type Turno } from "@/lib/agent";

export async function POST(request: Request) {
  const body = await request.json();
  const pergunta: string = body?.pergunta;
  const historico: Turno[] = Array.isArray(body?.historico) ? body.historico : [];

  if (!pergunta || typeof pergunta !== "string") {
    return NextResponse.json({ erro: "Envie uma pergunta valida." }, { status: 400 });
  }

  if (!process.env.GOOGLE_API_KEY) {
    return NextResponse.json(
      { erro: "GOOGLE_API_KEY nao configurada no servidor. Veja o .env.example." },
      { status: 503 },
    );
  }

  try {
    const resposta = await perguntar(historico, pergunta);
    return NextResponse.json({ resposta });
  } catch (erro) {
    console.error("Erro ao chamar o Rota Zero:", erro);
    return NextResponse.json(
      { erro: "Nao foi possivel falar com o Rota Zero agora. Tente novamente em instantes." },
      { status: 502 },
    );
  }
}
