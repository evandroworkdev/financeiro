export interface CategoriaInputDTO {
  id: string;
  nome: string;
  idPai: string | null;
  usuarioId: string;
}
