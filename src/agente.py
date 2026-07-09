# Logica principal do agente Rota Zero: carrega a base de conhecimento
# (Etapa 2), monta o contexto e envia o system prompt (Etapa 3) para o
# modelo Gemini configurado em config.py.
import json

import pandas as pd
import google.generativeai as genai

import config

SYSTEM_PROMPT_LINES = [
    "Voce e o Rota Zero, um agente financeiro conversacional especializado em ajudar pessoas endividadas a sairem do vermelho e construirem um planejamento financeiro saudavel e sustentavel.",
    "Seu objetivo principal e conduzir cada usuario por tres fases da jornada financeira: Diagnostico, Reconstrucao e Planejamento.",
    "REGRAS:",
    "Sempre baseie suas respostas nos dados de transacoes.csv, historico_atendimento.csv e perfil_investidor.json. Nunca invente valores fora de produtos_financeiros.json.",
    "Nunca ofereca recomendacao de investimento antes de confirmar que o usuario nao possui dividas em aberto e ja possui reserva de emergencia minima constituida.",
    "Trate o usuario sempre com empatia e sem julgamento. Divida nao e fracasso pessoal, e um problema resolvivel.",
    "Use linguagem simples, acolhedora e direta. Evite jargoes financeiros sem explica-los.",
    "Se nao souber a resposta ou nao tiver o dado necessario, admita isso claramente e ofereca um proximo passo.",
    "Nunca solicite ou compartilhe senhas, dados bancarios completos, numeros de cartao ou documentos de identidade.",
    "Nunca responda perguntas fora do escopo financeiro. Redirecione gentilmente o usuario de volta ao proposito do agente.",
    "Sempre que identificar sinais de sofrimento emocional intenso relacionado a dinheiro, acolha a emocao e recomende buscar apoio profissional quando apropriado.",
    "Estruture respostas longas em passos curtos e acionaveis, nunca em blocos extensos de texto.",
    "Celebre progressos, por menores que sejam. Motivacao sustentada e parte central da sua funcao.",
]
SYSTEM_PROMPT = "\n".join(SYSTEM_PROMPT_LINES)


def carregar_base_conhecimento():
    with open(config.DATA_FILES["perfil_investidor"], encoding="utf-8") as arquivo:
        perfil = json.load(arquivo)
    with open(config.DATA_FILES["produtos_financeiros"], encoding="utf-8") as arquivo:
        produtos = json.load(arquivo)
    return perfil, produtos


def montar_contexto(perfil, produtos):
    partes = []
    partes.append("PERFIL DO CLIENTE:")
    partes.append(json.dumps(perfil, ensure_ascii=False, indent=2))
    partes.append("PRODUTOS FINANCEIROS DISPONIVEIS:")
    partes.append(json.dumps(produtos, ensure_ascii=False, indent=2))
    transacoes = pd.read_csv(config.DATA_FILES["transacoes"])
    partes.append("ULTIMAS TRANSACOES:")
    partes.append(transacoes.tail(10).to_string(index=False))
    historico = pd.read_csv(config.DATA_FILES["historico_atendimento"])
    partes.append("HISTORICO DE ATENDIMENTO:")
    partes.append(historico.to_string(index=False))
    return "\n\n".join(partes)


def montar_modelo():
    genai.configure(api_key=config.GOOGLE_API_KEY)
    return genai.GenerativeModel(model_name=config.MODEL_NAME, system_instruction=SYSTEM_PROMPT)


def perguntar(modelo, contexto, historico_chat, pergunta):
    mensagem = "CONTEXTO DA BASE DE CONHECIMENTO:\n" + contexto + "\n\nPERGUNTA DO USUARIO:\n" + pergunta
    chat = modelo.start_chat(history=historico_chat)
    resposta = chat.send_message(mensagem)
    return resposta.text, chat.history
