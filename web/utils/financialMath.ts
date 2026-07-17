export interface ResultadoJurosCompostos {
  valorFinal: number;
  totalAportado: number;
  totalJuros: number;
}

/**
 * Valor futuro de um principal com aportes mensais constantes (aporte no
 * fim de cada periodo). taxaMensal em decimal (1% = 0.01).
 */
export function calcularJurosCompostos(
  principal: number,
  taxaMensal: number,
  meses: number,
  aporteMensal = 0,
): ResultadoJurosCompostos {
  const fatorCrescimento = Math.pow(1 + taxaMensal, meses);
  const valorPrincipalCorrigido = principal * fatorCrescimento;
  const valorAportes =
    taxaMensal === 0 ? aporteMensal * meses : aporteMensal * ((fatorCrescimento - 1) / taxaMensal);

  const valorFinal = valorPrincipalCorrigido + valorAportes;
  const totalAportado = principal + aporteMensal * meses;

  return {
    valorFinal,
    totalAportado,
    totalJuros: valorFinal - totalAportado,
  };
}

export interface ParcelaAmortizacao {
  numero: number;
  parcela: number;
  juros: number;
  amortizacao: number;
  saldoDevedor: number;
}

export interface ResumoAmortizacao {
  parcelas: ParcelaAmortizacao[];
  totalPago: number;
  totalJuros: number;
}

function resumirTabela(tabela: ParcelaAmortizacao[]): ResumoAmortizacao {
  const totalPago = tabela.reduce((soma, item) => soma + item.parcela, 0);
  const totalJuros = tabela.reduce((soma, item) => soma + item.juros, 0);
  return { parcelas: tabela, totalPago, totalJuros };
}

/**
 * Sistema Price (Tabela Price / francês): parcela fixa, juros decrescentes
 * e amortizacao crescente ao longo do financiamento.
 */
export function calcularAmortizacaoPrice(
  valorFinanciado: number,
  taxaMensal: number,
  numeroParcelas: number,
): ResumoAmortizacao {
  const parcelaFixa =
    taxaMensal === 0
      ? valorFinanciado / numeroParcelas
      : (valorFinanciado * taxaMensal * Math.pow(1 + taxaMensal, numeroParcelas)) /
        (Math.pow(1 + taxaMensal, numeroParcelas) - 1);

  const tabela: ParcelaAmortizacao[] = [];
  let saldoDevedor = valorFinanciado;

  for (let numero = 1; numero <= numeroParcelas; numero++) {
    const juros = saldoDevedor * taxaMensal;
    const amortizacao = parcelaFixa - juros;
    saldoDevedor = Math.max(0, saldoDevedor - amortizacao);
    tabela.push({ numero, parcela: parcelaFixa, juros, amortizacao, saldoDevedor });
  }

  return resumirTabela(tabela);
}

/**
 * SAC (Sistema de Amortizacao Constante): amortizacao fixa, juros e parcela
 * decrescentes ao longo do financiamento.
 */
export function calcularAmortizacaoSac(
  valorFinanciado: number,
  taxaMensal: number,
  numeroParcelas: number,
): ResumoAmortizacao {
  const amortizacaoFixa = valorFinanciado / numeroParcelas;
  const tabela: ParcelaAmortizacao[] = [];
  let saldoDevedor = valorFinanciado;

  for (let numero = 1; numero <= numeroParcelas; numero++) {
    const juros = saldoDevedor * taxaMensal;
    const parcela = amortizacaoFixa + juros;
    saldoDevedor = Math.max(0, saldoDevedor - amortizacaoFixa);
    tabela.push({ numero, parcela, juros, amortizacao: amortizacaoFixa, saldoDevedor });
  }

  return resumirTabela(tabela);
}

export interface ResultadoInflacao {
  valorNominalFuturo: number;
  poderDeCompraFuturo: number;
  perdaPercentual: number;
}

/**
 * Projeta o efeito da inflacao sobre um valor: quanto sera preciso
 * nominalmente para manter o poder de compra atual, e quanto esse mesmo
 * valor "vale" hoje se nao for corrigido.
 */
export function calcularProjecaoInflacao(
  valorAtual: number,
  taxaInflacaoAnual: number,
  anos: number,
): ResultadoInflacao {
  const fator = Math.pow(1 + taxaInflacaoAnual, anos);
  const valorNominalFuturo = valorAtual * fator;
  const poderDeCompraFuturo = valorAtual / fator;

  return {
    valorNominalFuturo,
    poderDeCompraFuturo,
    perdaPercentual: (1 - poderDeCompraFuturo / valorAtual) * 100,
  };
}
