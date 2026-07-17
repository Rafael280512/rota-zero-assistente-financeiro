# Rota Zero - Web App

Interface web (Next.js + React + TypeScript + Tailwind) do Rota Zero, o assistente financeiro conversacional. Substitui/complementa o protótipo em Streamlit (`src/`) por um site com:

- Chat com o agente Rota Zero, com sugestões de perguntas iniciais.
- Painel de diagnóstico financeiro (renda, patrimônio, saldo do mês, reserva de emergência, metas e gastos por categoria) calculado a partir dos dados mockados em `data/`.
- Layout responsivo, com suporte a modo escuro.

## Como executar localmente

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie `.env.example` para `.env.local` e preencha `GOOGLE_API_KEY` com uma chave gratuita gerada em https://aistudio.google.com/app/apikey

   ```bash
   cp .env.example .env.local
   ```

3. Rode o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Acesse http://localhost:3000

## Estrutura

```
web/
├── app/
│   ├── page.tsx          # Pagina principal (dashboard + chat)
│   ├── layout.tsx
│   └── api/chat/route.ts # Endpoint que fala com o Gemini
├── components/
│   ├── Dashboard.tsx     # Painel de diagnostico financeiro
│   └── ChatPanel.tsx     # Interface de chat (client component)
├── lib/
│   ├── data.ts           # Carrega e resume os dados mockados
│   └── agent.ts          # System prompt e chamada ao Gemini
└── data/                 # Copia dos dados mockados (perfil, produtos, transacoes, historico)
```

## Deploy

Por ser uma aplicação Next.js padrão, pode ser publicada em qualquer provedor compatível (Vercel, Netlify, etc.). Configure a variável de ambiente `GOOGLE_API_KEY` (e opcionalmente `ROTA_ZERO_MODEL`) nas configurações do projeto no provedor escolhido.
