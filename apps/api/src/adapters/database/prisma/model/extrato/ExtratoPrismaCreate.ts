export interface ExtratoPrismaCreate {
  id: string;
  usuario_id: string;
  data: Date;
  sumario_data: Date;
  sumario_total: number;
  sumario_receitas: number;
  sumario_despesas: number;
  created_at?: Date | null;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}
