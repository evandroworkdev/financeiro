export interface UsuarioOutputDTO {
  id: string;
  nome: string;
  email: string;
  provider: string | null;
  imagemUrl: string | null;
  config: {};
}
