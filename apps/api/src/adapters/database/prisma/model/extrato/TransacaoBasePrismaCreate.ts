export interface TransacaoBasePrismaCreate {
  id: string;
  recorrencia_id: string | null;
  usuario_id: string | null;
  conta_id: string | null;
  cartao_id: string | null;
  categoria_id: string | null;
  nome: string;
  valor: number;
  data: Date;
  consolidada: boolean;
  operacao: string;
  observacoes: string | null;
  numero_parcela: number | null;
  em_memoria: boolean | null;
  virtual: boolean | null;
  agrupar_por: string | null;
  base: boolean | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}
