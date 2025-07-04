export interface FaturaPrismaCreate {
  id: string;
  cartao_id: string;
  data: Date;
  valor: number;
  valor_planejado: number;
  created_at?: Date | null;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}
