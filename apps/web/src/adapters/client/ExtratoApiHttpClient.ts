import useApi from "@/data/hooks/useApi";
import { ExtratoApiClient, ExtratoDTO, RecorrenciaDTO, TransacaoDTO, UsuarioDTO } from "adapters";

export default class ExtratoApiHttpClient implements ExtratoApiClient {
  constructor(private api: ReturnType<typeof useApi>) {}

  async salvarTransacao(
    usuario: UsuarioDTO,
    extrato: ExtratoDTO,
    transacao: TransacaoDTO,
  ): Promise<void> {
    const endpoint = "/extratos/mensais";
    const resultadoApi = await this.api.httpPut(endpoint, { usuario, extrato, transacao });
    if (!resultadoApi.sucesso) throw resultadoApi.erros;
  }

  async excluirTransacao(
    usuario: UsuarioDTO,
    extrato: ExtratoDTO,
    transacao: TransacaoDTO,
  ): Promise<void> {
    const endpoint = "/extratos/mensais";
    await this.api.httpPatch(endpoint, { usuario, extrato, transacao });
  }

  async consultarTodos(usuario: UsuarioDTO, datas: Date[]): Promise<ExtratoDTO[]> {
    const endpoint = "/extratos/mensais";
    const resultadoApi = await this.api.httpPost(endpoint, { datas });
    return resultadoApi.json;
  }

  async salvarRecorrencia(usuario: UsuarioDTO, recorrencia: RecorrenciaDTO): Promise<void> {
    const endpoint = "/extratos/recorrencias";
    await this.api.httpPut(endpoint, { usuario, recorrencia });
  }

  async excluirRecorrencia(usuario: UsuarioDTO, recorrenciaId: string): Promise<void> {
    const endpoint = `/extratos/recorrencias/${recorrenciaId}`;
    await this.api.httpDelete(endpoint);
  }

  async consultarRecorrencia(usuario: UsuarioDTO, id: string): Promise<RecorrenciaDTO | null> {
    const endpoint = `/extratos/recorrencias/${id}`;
    const resultadoApi = await this.api.httpGet(endpoint);
    if (!resultadoApi.sucesso) return null;
    return resultadoApi.json;
  }

  async consultarRecorrencias(usuario: UsuarioDTO): Promise<RecorrenciaDTO[]> {
    const endpoint = "/extratos/recorrencias";
    const resultadoApi = await this.api.httpGet(endpoint);
    return resultadoApi.json;
  }
}
