import useApi from "@/data/hooks/useApi";
import { UsuarioApiClient, UsuarioDTO } from "adapters";

export default class UsuarioApiHttpClient implements UsuarioApiClient {
  constructor(private api: ReturnType<typeof useApi>) {}

  async consultar(usuario: UsuarioDTO): Promise<UsuarioDTO> {
    const endpoint = `/usuarios/email/${usuario.email}`;
    const resultadoApi = (await this.api.httpGet(endpoint)).json;
    return resultadoApi;
  }
  async salvar(usuario: UsuarioDTO): Promise<void> {
    const endpoint = `/usuarios/${usuario.id}`;
    await this.api.httpPut(endpoint, { usuario });
  }
}
