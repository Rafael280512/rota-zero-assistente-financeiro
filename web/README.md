# Rota Zero - Web App

Interface web (Next.js + React + TypeScript + Tailwind + Framer Motion + Recharts + Zustand) do Rota Zero, o assistente financeiro conversacional. Substitui/complementa o protótipo em Streamlit (`src/`) por um site com estética "3D overview" holográfica e 5 módulos:

- **Assistente** (`/`): chat com o Rota Zero + diagnóstico financeiro rápido.
- **Central de Comando** (`/dashboard`): patrimônio líquido, fluxo de caixa, distribuição de gastos, projeção de juros compostos a favor/contra e alertas de orçamento.
- **Ponto Zero** (`/dividas`): comparador Bola de Neve vs Avalanche, registro de pagamentos, simulador de renegociação e painel de vitórias.
- **Transações** (`/transacoes`): Data Grid editável (busca, filtros, ordenação, categorização em massa).
- **Investimentos** (`/investimentos`): bloqueado até quitar dívidas e completar a reserva de emergência.
- **Educação** (`/educacao`): conteúdos sobre essencialismo, hiperconsumo e patrimônio geracional.

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
├── app/                    # Rotas (uma pasta por modulo) + api/chat/route.ts
├── components/
│   ├── ui/                 # HoloPanel, NeonButton, ProgressBeam, StatPod
│   ├── layouts/             # AppShell, Sidebar, TopBar, PageTransition
│   ├── charts/              # Graficos Recharts com tema holografico
│   ├── dividas/, educacao/, transacoes/  # Componentes especificos de cada modulo
│   ├── Dashboard.tsx e ChatPanel.tsx      # Modulo Assistente
├── store/useFinanceStore.ts # Estado global (Zustand + persist em localStorage)
├── hooks/                  # useJourneyPhase, useDashboardData
├── utils/                  # financialMath.ts, debtStrategy.ts
├── lib/                    # Carregamento de dados server-side (usado por app/page.tsx)
└── data/                   # Dados mockados (perfil, produtos, transacoes, dividas, conteudos)
```

## Deploy

### Vercel (ou qualquer host Node/Next completo)

Deploy padrão de app Next.js. Configure `GOOGLE_API_KEY` (e opcionalmente `ROTA_ZERO_MODEL`) nas variáveis de ambiente do provedor — o chat com o Gemini funciona normalmente via `/api/chat`.

### GitHub Pages (demo estático, sem chat funcional)

Existe um workflow (`.github/workflows/deploy-pages.yml`) que gera um export estático e publica em `https://<usuario>.github.io/rota-zero-assistente-financeiro/` a cada push nas branches configuradas. Como o GitHub Pages não roda servidor, a rota `/api/chat` é removida no build e o chat entra em "modo demo" (responde com uma mensagem fixa explicando a limitação) — todos os outros módulos (dashboard, dívidas, transações, investimentos, educação) funcionam normalmente, já que rodam inteiramente no cliente.

Na primeira vez, pode ser necessário habilitar manualmente em **Settings → Pages → Build and deployment → Source → GitHub Actions** (depois disso o deploy é 100% automático a cada push).

Para gerar esse build manualmente (o export estático não suporta a rota de API, por isso ela precisa ser removida antes do build - é isso que o workflow faz):

```bash
rm -rf app/api
GITHUB_PAGES=true NEXT_PUBLIC_STATIC_DEMO=true npm run build
# o resultado fica em web/out
```
