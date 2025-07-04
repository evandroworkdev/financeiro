import useApi from "@/data/hooks/useApi";
import { ProvedorDadosUsuario, UsuarioInputDTO, UsuarioOutputDTO } from "adapters";

class UsuarioProvedorDados implements ProvedorDadosUsuario {
  constructor(private api: ReturnType<typeof useApi>) {}

  async salvar(usuario: UsuarioInputDTO): Promise<void> {
    const endpoint = `/usuarios/${usuario.id}`;
    await this.api.httpPut(endpoint, { usuario });
  }

  async consultarPorEmail(email: string): Promise<UsuarioOutputDTO | null> {
    const endpoint = `/usuarios/email/${email}`;
    const resultadoApi = await this.api.httpGet(endpoint);
    if (!resultadoApi.sucesso) return null;
    return resultadoApi.json;
  }
}

export { UsuarioProvedorDados };
