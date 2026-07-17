import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT, montarContextoBase, montarContextoPerfil } from "@/lib/agente";
import type { MensagemHistorico, PerfilUsuario } from "@/lib/agente";

export const runtime = "nodejs";
const MODEL = process.env.ROTA_ZERO_MODEL || "gemini-flash-latest";

export async function POST(req: NextRequest) {
      try {
              const body = await req.json();
              const pergunta = typeof body?.pergunta === "string" ? body.pergunta : "";
              const historico: MensagemHistorico[] = Array.isArray(body?.historico) ? body.historico : [];
              const perfil: PerfilUsuario | null = body?.perfil ?? null;
              const apiKey = process.env.GOOGLE_API_KEY;
              if (!apiKey) return NextResponse.json({ error: "GOOGLE_API_KEY nao configurada." }, { status: 500 });
              const contents: MensagemHistorico[] = [];
              if (historico.length === 0) {
                        const abertura = [SYSTEM_PROMPT, "", montarContextoBase(), "", montarContextoPerfil(perfil)].join("\n");
                        contents.push({ role: "user", parts: [{ text: abertura }] });
                        contents.push({ role: "model", parts: [{ text: "Entendido. Vou me apresentar e conduzir a conversa." }] });
              }
              for (const h of historico) contents.push(h);
              contents.push({ role: "user", parts: [{ text: pergunta }] });
              const url = "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent?key=" + apiKey;
              const resp = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents }) });
              if (!resp.ok) {
                        const t = await resp.text();
                        return NextResponse.json({ error: "Erro Gemini: " + t.slice(0, 300) }, { status: 502 });
              }
              const dados = await resp.json();
              const bruto = dados?.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, nao consegui responder agora.";
              let perfilAtualizado: PerfilUsuario | null = null;
              const m = bruto.match(/<PERFIL>([\s\S]*?)<\/PERFIL>/);
              if (m) { try { perfilAtualizado = JSON.parse(m[1]); } catch (e) { perfilAtualizado = null; } }
              const respostaLimpa = bruto.replace(/<PERFIL>[\s\S]*?<\/PERFIL>/g, "").trim();
              const novoHistorico: MensagemHistorico[] = [...historico, { role: "user", parts: [{ text: pergunta }] }, { role: "model", parts: [{ text: bruto }] }];
              return NextResponse.json({ resposta: respostaLimpa, perfil: perfilAtualizado, historico: novoHistorico });
      } catch (err) {
              const msg = err instanceof Error ? err.message : String(err);
              return NextResponse.json({ error: "Erro interno: " + msg }, { status: 500 });
      }
}
