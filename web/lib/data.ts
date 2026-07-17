export const perfilInvestidor = {
    nome: "Joao Silva",
    idade: 32,
    profissao: "Analista de Sistemas",
    renda_mensal: 5000.0,
    perfil_investidor: "moderado",
    objetivo_principal: "Construir reserva de emergencia",
    patrimonio_total: 15000.0,
    reserva_emergencia_atual: 10000.0,
    aceita_risco: false,
    metas: [
      { meta: "Completar reserva de emergencia", valor_necessario: 15000.0, prazo: "2026-06" },
      { meta: "Entrada do apartamento", valor_necessario: 50000.0, prazo: "2027-12" },
        ],
};

export const produtosFinanceiros = [
  {
        nome: "Tesouro Selic",
        categoria: "renda_fixa",
        risco: "baixo",
        rentabilidade: "100% da Selic",
        aporte_minimo: 30.0,
        indicado_para: "Reserva de emergencia e iniciantes",
  },
  {
        nome: "CDB Liquidez Diaria",
        categoria: "renda_fixa",
        risco: "baixo",
        rentabilidade: "102% do CDI",
        aporte_minimo: 100.0,
        indicado_para: "Quem busca seguranca com rendimento diario",
  },
  {
        nome: "LCI/LCA",
        categoria: "renda_fixa",
        risco: "baixo",
        rentabilidade: "95% do CDI",
        aporte_minimo: 1000.0,
        indicado_para: "Quem pode esperar 90 dias (isento de IR)",
  },
  {
        nome: "Fundo Multimercado",
        categoria: "fundo",
        risco: "medio",
        rentabilidade: "CDI + 2%",
        aporte_minimo: 500.0,
        indicado_para: "Perfil moderado que busca diversificacao",
  },
  {
        nome: "Fundo de Acoes",
        categoria: "fundo",
        risco: "alto",
        rentabilidade: "Variavel",
        aporte_minimo: 100.0,
        indicado_para: "Perfil arrojado com foco no longo prazo",
  },
  ];

export const transacoes = [
  { data: "2025-10-01", descricao: "Salario", categoria: "receita", valor: 5000.0, tipo: "entrada" },
  { data: "2025-10-02", descricao: "Aluguel", categoria: "moradia", valor: 1200.0, tipo: "saida" },
  { data: "2025-10-03", descricao: "Supermercado", categoria: "alimentacao", valor: 450.0, tipo: "saida" },
  { data: "2025-10-05", descricao: "Netflix", categoria: "lazer", valor: 55.9, tipo: "saida" },
  { data: "2025-10-07", descricao: "Farmacia", categoria: "saude", valor: 89.0, tipo: "saida" },
  { data: "2025-10-10", descricao: "Restaurante", categoria: "alimentacao", valor: 120.0, tipo: "saida" },
  { data: "2025-10-12", descricao: "Uber", categoria: "transporte", valor: 45.0, tipo: "saida" },
  { data: "2025-10-15", descricao: "Conta de Luz", categoria: "moradia", valor: 180.0, tipo: "saida" },
  { data: "2025-10-20", descricao: "Academia", categoria: "saude", valor: 99.0, tipo: "saida" },
  { data: "2025-10-25", descricao: "Combustivel", categoria: "transporte", valor: 250.0, tipo: "saida" },
  ];

export const historicoAtendimento = [
  { data: "2025-09-15", canal: "chat", tema: "CDB", resumo: "Cliente perguntou sobre rentabilidade e prazos", resolvido: "sim" },
  { data: "2025-09-22", canal: "telefone", tema: "Problema no app", resumo: "Erro ao visualizar extrato foi corrigido", resolvido: "sim" },
  { data: "2025-10-01", canal: "chat", tema: "Tesouro Selic", resumo: "Cliente pediu explicacao sobre o funcionamento do Tesouro Direto", resolvido: "sim" },
  { data: "2025-10-12", canal: "chat", tema: "Metas financeiras", resumo: "Cliente acompanhou o progresso da reserva de emergencia", resolvido: "sim" },
  { data: "2025-10-25", canal: "email", tema: "Atualizacao cadastral", resumo: "Cliente atualizou e-mail e telefone", resolvido: "sim" },
  ];
