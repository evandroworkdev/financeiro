import useApi from "@/data/hooks/useApi";
import { CategoriaApiClient, CategoriaDTO, UsuarioDTO } from "adapters";

export default class CategoriaApiHttpClient implements CategoriaApiClient {
  constructor(private api: ReturnType<typeof useApi>) {}

  async consultar(usuario: UsuarioDTO): Promise<CategoriaDTO[]> {
    const endpoint = "/categorias";
    const resultApi = (await this.api.httpGet(endpoint)).json;
    return resultApi;
  }

  async salvar(usuario: UsuarioDTO, categoria: CategoriaDTO): Promise<void> {
    const categoriaId = categoria.id;
    const endpoint = `/categorias`;
    await this.api.httpPut(endpoint, { usuario, categoria });
  }

  async salvarTodas(usuario: UsuarioDTO, categorias: CategoriaDTO[]): Promise<void> {
    const endpoint = "/categorias";
    await this.api.httpPost(endpoint, { categorias });
  }

  async excluir(usuario: UsuarioDTO, categoria: CategoriaDTO): Promise<void> {
    const endpoint = `/categorias/${categoria.id}`;
    await this.api.httpPatch(endpoint, { categoria });
  }
}
