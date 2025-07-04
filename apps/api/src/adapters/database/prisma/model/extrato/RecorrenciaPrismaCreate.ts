export interface RecorrenciaPrismaCreate {
  id: string;
  usuario_id: string | null;
  data_fim: Date | null;
  indefinida: boolean;
  iniciar_na_parcela: number;
  qtde_de_parcelas: number | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}
