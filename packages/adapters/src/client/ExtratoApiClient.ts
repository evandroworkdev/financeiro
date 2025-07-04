import { ExtratoDTO, RecorrenciaDTO, TransacaoDTO, UsuarioDTO } from "../dto";

export default interface ExtratoApiClient {
  salvarTransacao(usuario: UsuarioDTO, extrato: ExtratoDTO, transacao: TransacaoDTO): Promise<void>;
  salvarRecorrencia(usuario: UsuarioDTO, recorrencia: RecorrenciaDTO): Promise<void>;
  consultarTodos(usuario: UsuarioDTO, datas: Date[]): Promise<ExtratoDTO[]>;
  consultarRecorrencia(usuario: UsuarioDTO, id: string): Promise<RecorrenciaDTO | null>;
  consultarRecorrencias(usuario: UsuarioDTO): Promise<RecorrenciaDTO[]>;
  excluirTransacao(
    usuario: UsuarioDTO,
    extrato: ExtratoDTO,
    transacao: TransacaoDTO,
  ): Promise<void>;
  excluirRecorrencia(usuario: UsuarioDTO, recorrenciaId: string): Promise<void>;
}
