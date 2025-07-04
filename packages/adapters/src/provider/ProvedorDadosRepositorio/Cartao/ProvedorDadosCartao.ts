import { CartaoInputDTO } from "./CartaoInputDTO";
import { CartaoOutputDTO } from "./CartaoOutputDTO";

export default interface ProvedorDadosCartao {
  salvar(usuarioId: string, cartao: CartaoInputDTO): Promise<void>;
  salvarTodos(usuarioId: string, cartoes: CartaoInputDTO[]): Promise<void>;
  consultar(usuarioId: string): Promise<CartaoOutputDTO[]>;
  excluir(usuarioId: string, cartaoId: string): Promise<void>;
}
