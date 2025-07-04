import { ExtratoInputDTO } from "./ExtratoInputDTO";
import { ExtratoOutputDTO } from "./ExtratoOutputDTO";
import { RecorrenciaInputDTO } from "./RecorrenciaInputDTO";
import { RecorrenciaOutputDTO } from "./RecorrenciaOutputDTO";

export default interface ProvedorDadosExtrato {
  salvar(usuarioId: string, extrato: ExtratoInputDTO): Promise<void>;
  salvarTodos(usuarioId: string, extrato: ExtratoInputDTO[]): Promise<void>;
  salvarRecorrencia(
    usuarioId: string,
    extrato: ExtratoInputDTO[],
    recorrencia: RecorrenciaInputDTO,
  ): Promise<void>;

  consultar(usuarioId: string): Promise<ExtratoOutputDTO[]>;
  consultarPorId(usuarioId: string, id: string): Promise<ExtratoOutputDTO | null>;
  consultarPorIds(usuarioId: string, ids: string[]): Promise<ExtratoOutputDTO[]>;

  consultarRecorrencias(usuarioId: string): Promise<RecorrenciaOutputDTO[]>;
  consultarRecorrenciasPorMes(usuarioId: string, data: Date): Promise<RecorrenciaOutputDTO[]>;
  consultarRecorrenciaPorId(usuarioId: string, id: string): Promise<RecorrenciaOutputDTO | null>;

  excluirRecorrencia(
    usuarioId: string,
    extratos: ExtratoInputDTO[],
    recorrencia: RecorrenciaInputDTO,
  ): Promise<void>;
}
