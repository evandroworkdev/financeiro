export interface UsuarioInputDTO {
  id: string;
  nome: string;
  email: string;
  provider: string | null;
  imagemUrl: string | null;
  config: {};
}
