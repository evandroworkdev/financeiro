import { CartaoDTO, UsuarioDTO } from "../dto";

export default interface CartaoApiClient {
  consultar(usuario: UsuarioDTO): Promise<CartaoDTO[]>;
  salvar(usuario: UsuarioDTO, cartao: CartaoDTO): Promise<void>;
  excluir(usuario: UsuarioDTO, cartao: CartaoDTO): Promise<void>;
}
