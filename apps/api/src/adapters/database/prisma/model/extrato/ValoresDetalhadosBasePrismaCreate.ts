export interface ValoresDetalhadosBasePrismaCreate {
  id: string;
  transacao_base_id: string;
  descricao: string;
  valor: number;
  operacao: string;
  created_at?: Date | null;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}
