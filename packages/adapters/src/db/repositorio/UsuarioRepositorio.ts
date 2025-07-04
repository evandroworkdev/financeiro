import { RepositorioUsuario, Resultado, Usuario, UsuarioProps } from "core";
import { ProvedorDadosUsuario, UsuarioInputDTO, UsuarioOutputDTO } from "../../provider";

export default class UsuarioRepositorio implements RepositorioUsuario {
  constructor(private readonly usuarioProvedorDados: ProvedorDadosUsuario) {}

  async salvar(usuario: Usuario): Promise<Resultado<void>> {
    const usuarioInput = this.toUsuarioInputFromUsuario(usuario);
    await this.usuarioProvedorDados.salvar(usuarioInput);
    return Resultado.ok();
  }
  async consultarPorEmail(email: string): Promise<Resultado<Usuario | null>> {
    const consultaDb = await this.usuarioProvedorDados.consultarPorEmail(email);
    if (!consultaDb) return Resultado.nulo();
    const usuarioProps = this.toUsuarioPropsFromUsuarioOutput(consultaDb);
    return Usuario.novo(usuarioProps);
  }

  private toUsuarioInputFromUsuario(usuario: Usuario): UsuarioInputDTO {
    return {
      id: usuario.id.valor,
      nome: usuario.nome.valor,
      email: usuario.email.valor,
      provider: usuario.provider,
      imagemUrl: usuario.imagemUrl?.valor ?? null,
      config: usuario.config,
    };
  }
  private toUsuarioPropsFromUsuarioOutput(cartaoOutputDTO: UsuarioOutputDTO): UsuarioProps {
    return {
      id: cartaoOutputDTO.id,
      nome: cartaoOutputDTO.nome,
      email: cartaoOutputDTO.email,
      provider: cartaoOutputDTO.provider ?? undefined,
      imagemUrl: cartaoOutputDTO.imagemUrl,
      config: cartaoOutputDTO.config,
    };
  }
}
