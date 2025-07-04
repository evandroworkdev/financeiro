import { CategoriaInputDTO } from "./CategoriaInputDTO";
import { CategoriaOutputDTO } from "./CategoriaOutputDTO";

export default interface ProvedorDadosCategoria {
  salvar(usuarioId: string, cartao: CategoriaInputDTO): Promise<void>;
  salvarTodas(usuarioId: string, cartoes: CategoriaInputDTO[]): Promise<void>;
  consultar(usuarioId: string): Promise<CategoriaOutputDTO[]>;
  excluir(usuarioId: string, cartaoId: string): Promise<void>;
}
