import { PrismaClient } from "@prisma/client";
import { ProvedorDadosUsuario, UsuarioInputDTO, UsuarioOutputDTO } from "adapters";
import { UsuarioPrismaSchema } from "./prisma/model/usuario/UsuarioPrismaSchema";
import { UsuarioPrismaCreate } from "./prisma/model/usuario/UsuarioPrismaCreate";

export default class UsuarioProvedorDadosPrismaAdapter implements ProvedorDadosUsuario {
  constructor(private readonly prisma: PrismaClient) {}

  async salvar(usuario: UsuarioInputDTO): Promise<void> {
    const dados = this.toUsuarioPrismaCreateFromUsuarioInput(usuario);
    await this.prisma.usuarios.upsert({
      where: {
        id: usuario.id,
      },
      update: { ...dados, updated_at: new Date() },
      create: { ...dados, updated_at: new Date() },
    });
  }
  async consultarPorEmail(email: string): Promise<UsuarioOutputDTO | null> {
    const usuarioDb = await this.prisma.usuarios.findUnique({
      where: {
        email: email,
      },
    });
    if (!usuarioDb) return null;

    const usuarioOutput = this.toUsuarioOutputFromUsuarioSchema(usuarioDb);
    return usuarioOutput;
  }

  private toUsuarioPrismaCreateFromUsuarioInput(usuario: UsuarioInputDTO): UsuarioPrismaCreate {
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      provider: usuario.provider,
      imagem_url: usuario.imagemUrl,
      config: usuario.config,
    };
  }

  private toUsuarioOutputFromUsuarioSchema(usuarioSchema: UsuarioPrismaSchema): UsuarioOutputDTO {
    return {
      id: usuarioSchema.id,
      nome: usuarioSchema.nome,
      email: usuarioSchema.email,
      provider: usuarioSchema.provider,
      imagemUrl: usuarioSchema.imagem_url,
      config: usuarioSchema.config as {},
    };
  }
}
