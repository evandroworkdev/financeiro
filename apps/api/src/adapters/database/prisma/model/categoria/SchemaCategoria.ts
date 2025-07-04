export interface CategoriaSchema {
  id: string;
  usuario_id: string | null;
  id_pai: string | null;
  nome: string;
  created_at?: Date | null;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}
