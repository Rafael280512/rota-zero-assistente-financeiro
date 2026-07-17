# 🧭 Rota Zero - Assistente Financeiro Inteligente

## Contexto

Este repositorio e um fork adaptado do Lab da DIO "Construa Seu Assistente Virtual Com Inteligencia Artificial". O tema escolhido foi ajudar pessoas endividadas a saírem do vermelho e construírem, passo a passo, um planejamento financeiro saudavel, ate chegarem ao ponto de conseguir investir de forma consciente.

## O Que e o Rota Zero?

O Rota Zero e um agente conversacional educativo que conduz a pessoa usuaria por tres fases: Diagnostico da situacao financeira atual, Reconstrucao (quitacao de dividas e reserva de emergencia) e Planejamento (investimentos compatíveis com o perfil, apenas depois que a pessoa estiver fora do vermelho).

O que o Rota Zero faz:
- Acolhe a pessoa usuaria sem julgamento em relacao as suas dividas
- Usa a base de conhecimento (perfil, transacoes, historico e produtos financeiros) para dar respostas concretas
- Estrutura respostas longas em passos curtos e acionaveis
- Reconhece quando nao tem informacao suficiente e pede mais dados

O que o Rota Zero NAO faz:
- Nao substitui um profissional certificado (educador financeiro, psicologo, advogado)
- Nao acessa dados bancarios sensiveis (senhas, numeros de cartao, documentos)
- Nao recomenda investimentos antes de confirmar que a pessoa esta livre de dividas em aberto

## Arquitetura

- Interface web (recomendada): Next.js + React + TypeScript + Tailwind (`web/`)
- Interface alternativa/protótipo original: Streamlit (`src/app.py`)
- LLM: Google Gemini, via `@google/generative-ai` (web) ou `google-generativeai` (Streamlit), camada gratuita do Google AI Studio
- Dados: JSON/CSV mockados em data/ (perfil do investidor, transacoes, historico de atendimento e produtos financeiros)

## Estrutura do Projeto

```
rota-zero-assistente-financeiro/
├── data/                    # Base de conhecimento (Etapa 2)
├── docs/                    # Documentacao completa (Etapas 1, 2, 3, 5 e 6)
├── web/                     # App web (Next.js) - chat + dashboard financeiro
│   ├── app/                 # Paginas e rota da API de chat
│   ├── components/          # Dashboard e painel de chat
│   ├── lib/                 # Logica do agente e carregamento dos dados
│   └── data/                # Copia dos dados mockados usada pelo app web
├── src/
│   ├── app.py               # Interface Streamlit (Etapa 4)
│   ├── agente.py            # Logica do agente e system prompt (Etapa 3)
│   ├── config.py            # Configuracoes e variaveis de ambiente
│   └── requirements.txt     # Dependencias
├── .env.example              # Modelo de variaveis de ambiente
└── README.md
```

## Como Executar Localmente

### App Web (Next.js) - recomendado

```
cd web
npm install
cp .env.example .env.local   # preencha GOOGLE_API_KEY (https://aistudio.google.com/app/apikey)
npm run dev
```

Acesse http://localhost:3000. Mais detalhes em [`web/README.md`](web/README.md).

### Demo publica (GitHub Pages)

A cada push, um workflow do GitHub Actions publica um build estatico do app web em `https://<usuario>.github.io/rota-zero-assistente-financeiro/`. Todos os modulos funcionam normalmente (dashboard, dividas, transacoes, investimentos, educacao); o chat com IA entra em modo demo (sem backend, responde com uma mensagem fixa) porque o GitHub Pages nao roda servidor. Veja [`web/README.md`](web/README.md#deploy) para detalhes.

### Prototipo Streamlit (alternativo)

1. Instale as dependencias:

```
pip install -r src/requirements.txt
```

2. Copie `.env.example` para `.env` e preencha `GOOGLE_API_KEY` com uma chave gratuita gerada em https://aistudio.google.com/app/apikey

3. Rode a aplicacao:

```
streamlit run src/app.py
```

## Documentacao Completa

Para acessar a documentação completa do projeto Rota Zero, incluindo todas as 6 etapas estruturadas com detalhes, visite:
[Documentação Completa - Google Docs](https://docs.google.com/document/d/1l40bYaDzjDyox5QPaxLVUFPcVpxFhv8GWmp5olFpdAI/edit?usp=sharing)

A documentacao detalhada de cada etapa do desafio (persona, base de conhecimento, prompts, metricas e pitch) esta disponivel na pasta `docs/` e tambem em um Google Docs organizado por etapas, produzido durante o desenvolvimento deste projeto.
