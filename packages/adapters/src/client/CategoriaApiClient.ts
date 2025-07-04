import { CategoriaDTO, UsuarioDTO } from "../dto";

export default interface CategoriaApiClient {
  consultar(usuario: UsuarioDTO): Promise<CategoriaDTO[]>;
  salvar(usuario: UsuarioDTO, categoria: CategoriaDTO): Promise<void>;
  salvarTodas(usuario: UsuarioDTO, categorias: CategoriaDTO[]): Promise<void>;
  excluir(usuario: UsuarioDTO, categoria: CategoriaDTO): Promise<void>;
}
