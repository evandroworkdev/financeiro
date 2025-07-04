import { ContaDTO, UsuarioDTO } from "../dto";

export default interface ContaApiClient {
  consultar(usuario: UsuarioDTO): Promise<ContaDTO[]>;
  salvar(usuario: UsuarioDTO, conta: ContaDTO): Promise<void>;
  excluir(usuario: UsuarioDTO, conta: ContaDTO): Promise<void>;
}
