import { ContaInputDTO } from "./ContaInputDTO";
import { ContaOutputDTO } from "./ContaOutputDTO";

export default interface ProvedorDadosConta {
  salvar(usuarioId: string, cartao: ContaInputDTO): Promise<void>;
  salvarTodas(usuarioId: string, cartoes: ContaInputDTO[]): Promise<void>;
  consultar(usuarioId: string): Promise<ContaOutputDTO[]>;
  excluir(usuarioId: string, cartaoId: string): Promise<void>;
}
