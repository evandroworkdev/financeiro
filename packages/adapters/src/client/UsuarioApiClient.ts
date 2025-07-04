import { UsuarioDTO } from "../dto";

export default interface UsuarioApiClient {
  consultar(usuario: UsuarioDTO): Promise<UsuarioDTO>;
  salvar(usuario: UsuarioDTO): Promise<void>;
}
