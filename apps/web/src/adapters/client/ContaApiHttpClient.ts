import useApi from "@/data/hooks/useApi";
import { ContaApiClient, ContaDTO, UsuarioDTO } from "adapters";

export default class ContaApiHttpClient implements ContaApiClient {
  constructor(private api: ReturnType<typeof useApi>) {}

  async consultar(usuario: UsuarioDTO): Promise<ContaDTO[]> {
    const endpoint = "/contas";
    const resultado = (await this.api.httpGet(endpoint)).json;
    return resultado;
  }

  async salvar(usuario: UsuarioDTO, conta: ContaDTO): Promise<void> {
    const endpoint = "/contas";
    await this.api.httpPut(endpoint, { usuario, conta });
  }

  async excluir(usuario: UsuarioDTO, conta: ContaDTO): Promise<void> {
    const endpoint = `"/contas/${conta.id}"`;
    await this.api.httpPatch(endpoint, { usuario, conta });
  }
}
