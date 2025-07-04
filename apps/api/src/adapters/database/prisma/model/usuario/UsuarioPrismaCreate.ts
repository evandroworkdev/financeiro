export interface UsuarioPrismaCreate {
  id: string;
  nome: string;
  email: string;
  provider: string | null;
  imagem_url: string | null;
  config: {};
  created_at?: Date | null;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}
