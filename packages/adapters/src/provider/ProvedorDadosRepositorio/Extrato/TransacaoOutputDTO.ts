export interface TransacaoOutputDTO {
  id: string;
  nome: string;
  valor: number;
  data: Date;
  consolidada: boolean;
  operacao: string;
  observacoes: string | null;
  contaId: string | null;
  cartaoId: string | null;
  categoriaId: string | null;
  numeroParcela: number | null;
  recorrenciaId: string | null;
  valoresDetalhados: [];
  emMemoria: boolean;
  virtual: boolean;
  agruparPor: string | null;
}
