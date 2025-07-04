export interface CartaoPrismaCreate {
  id: string;
  usuario_id: string | null;
  descricao: string;
  bandeira: string;
  cor: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}
