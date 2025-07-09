import { PrismaClient } from "@prisma/client";
import { CategoriaInputDTO, CategoriaOutputDTO, ProvedorDadosCategoria } from "adapters";
import { CategoriaSchema } from "./prisma/model";

export default class CategoriaProvedorDadosPrismaAdapter implements ProvedorDadosCategoria {
  constructor(private readonly prisma: PrismaClient) {}

  async salvar(usuarioId: string, categoria: CategoriaInputDTO): Promise<void> {
    const dados = this.toCategoriaSchemaFromCategoriaInput(categoria, usuarioId);
    const now = new Date();
    await this.prisma.categorias.upsert({
      where: { usuario_id: usuarioId, id: categoria.id },
      create: { ...dados, created_at: now },
      update: { ...dados, updated_at: now },
    });
  }
  async salvarTodas(usuarioId: string, categorias: CategoriaInputDTO[]): Promise<void> {
    const now = new Date();
    await this.prisma.$transaction(async (trans) => {
      for (const categoria of categorias) {
        const dados = this.toCategoriaSchemaFromCategoriaInput(categoria, usuarioId);
        await trans.categorias.upsert({
          where: { id: categoria.id },
          create: { ...dados, created_at: now },
          update: { ...dados, updated_at: now },
        });
      }
    });
  }
  async consultar(usuarioId: string): Promise<CategoriaOutputDTO[]> {
    const categoriasDb = await this.prisma.categorias.findMany({
      where: { usuario_id: usuarioId, deleted_at: null },
    });

    const categoriasOutputDTO = categoriasDb.map((c: CategoriaSchema) =>
      this.toCategoriaOutputFromCategoriaSchema(c),
    );
    return categoriasOutputDTO;
  }

  async excluir(usuarioId: string, categoriaId: string): Promise<void> {
    await this.prisma.categorias.update({
      where: {
        id: categoriaId,
        usuario_id: usuarioId,
      },
      data: { deleted_at: new Date() },
    });
  }

  private toCategoriaSchemaFromCategoriaInput(
    categoria: CategoriaInputDTO,
    usuarioId: string,
  ): CategoriaSchema {
    return {
      id: categoria.id,
      nome: categoria.nome,
      id_pai: categoria.idPai,
      usuario_id: usuarioId,
    };
  }
  private toCategoriaOutputFromCategoriaSchema(
    categoriaSchema: CategoriaSchema,
  ): CategoriaOutputDTO {
    return {
      id: categoriaSchema.id,
      nome: categoriaSchema.nome,
      idPai: categoriaSchema.id_pai,
    };
  }
}
