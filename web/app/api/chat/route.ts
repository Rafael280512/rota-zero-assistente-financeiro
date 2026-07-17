import { NextRequest, NextResponse } from "next/server";
import { perguntar, type MensagemHistorico } from "@/lib/agente";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
          const body = await req.json();
          const pergunta: string = body?.pergunta;
          const historico: MensagemHistorico[] = body?.historico || [];

      if (!pergunta || typeof pergunta !== "string") {
              return NextResponse.json({ error: "Campo 'pergunta' e obrigatorio." }, { status: 400 });
      }

      const { resposta, historico: novoHistorico } = await perguntar(historico, pergunta);
          return NextResponse.json({ resposta, historico: novoHistorico });
    } catch (err) {
          const mensagem = err instanceof Error ? err.message : "Erro interno.";
          return NextResponse.json({ error: mensagem }, { status: 500 });
    }
}
