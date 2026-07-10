# Configuracoes do agente Rota Zero.
# A chave da API do Google Gemini NUNCA deve ser escrita neste arquivo.
# Ela deve ser fornecida via variavel de ambiente GOOGLE_API_KEY,
# definida localmente em um arquivo .env (veja .env.example) ou como
# Secret no ambiente onde a aplicacao for executada.
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
# gemini-2.0-flash tem cota gratuita 0 em varios projetos novos do
# Google AI Studio (testado na Etapa 5). gemini-flash-latest aponta
# sempre para o modelo flash estavel mais recente disponivel na cota
# gratuita, por isso e o padrao aqui.
MODEL_NAME = os.getenv("ROTA_ZERO_MODEL", "gemini-flash-latest")

DATA_FILES = {
    "perfil_investidor": DATA_DIR / "perfil_investidor.json",
    "produtos_financeiros": DATA_DIR / "produtos_financeiros.json",
    "transacoes": DATA_DIR / "transacoes.csv",
    "historico_atendimento": DATA_DIR / "historico_atendimento.csv",
}
