import useApi from "@/data/hooks/useApi";
import { CartaoApiClient, CartaoDTO, UsuarioDTO } from "adapters";

export default class CartaoApiHttpClient implements CartaoApiClient {
  constructor(private api: ReturnType<typeof useApi>) {}

  async consultar(usuario: UsuarioDTO): Promise<CartaoDTO[]> {
    const endpoint = "/cartoes";
    const resultado = (await this.api.httpGet(endpoint)).json;
    return resultado;
  }

  async salvar(usuario: UsuarioDTO, cartao: CartaoDTO): Promise<void> {
    const endpoint = "/cartoes";
    await this.api.httpPut(endpoint, { usuario, cartao });
  }

  async excluir(usuario: UsuarioDTO, cartao: CartaoDTO): Promise<void> {
    const endpoint = `/cartoes/${cartao.id}`;
    await this.api.httpPatch(endpoint, { usuario, cartao });
  }
}
