/**
 * Feature flags para seções que dependem de dados reais ainda não disponíveis.
 *
 * Como ativar:
 *   1. Substitua o dado mock pela informação real no arquivo correspondente
 *   2. Mude o flag de false → true
 *   3. Atualize docs/MELHORIAS-PENDENTES.md marcando o item como ✅
 *
 * Referência de dados: docs/MELHORIAS-PENDENTES.md seção "Conteúdo mock pendente"
 */

export const FLAGS = {
  /**
   * Seção "Resultados" em /imoveis (métricas: ocupação, receita, nº imóveis).
   * Dados em: src/routes/imoveis.tsx → constante RESULTADOS
   */
  RESULTADOS_IMOVEIS: true,

  /**
   * Seção "Avaliações" em /imoveis (notas Airbnb, Booking.com, Google).
   * Dados em: src/routes/imoveis.tsx → constante APP_RATINGS
   */
  NOTAS_APPS: true,

  /**
   * Seção "Depoimentos" em /imoveis (feedback de hóspedes sobre atendimento SC Stays).
   * Dados em: src/routes/imoveis.tsx → constante DEPOIMENTOS
   */
  DEPOIMENTOS_HOSPEDES: true,
} as const;

export type FeatureFlag = keyof typeof FLAGS;
