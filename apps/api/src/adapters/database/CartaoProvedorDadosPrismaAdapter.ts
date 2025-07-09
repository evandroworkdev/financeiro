import { PrismaClient } from "@prisma/client";
import {
  ProvedorDadosCartao,
  CartaoInputDTO,
  CartaoOutputDTO,
  FaturaInputDTO,
  FaturaOutputDTO,
} from "adapters";
import { CartaoPrismaCreate } from "./prisma/model/cartao/CartaoPrismaCreate";
import { CartaoPrismaSchema } from "./prisma/model/cartao/CartaoPrismaSchema";
import { FaturaPrismaCreate } from "./prisma/model/cartao/FaturaPrismaCreate";
import { FaturaPrismaSchema } from "./prisma/model/cartao/FaturaPrismaSchema";

export default class CartaoProvedorDadosPrismaAdapter implements ProvedorDadosCartao {
  constructor(private readonly prisma: PrismaClient) {}

  async salvar(usuarioId: string, cartao: CartaoInputDTO): Promise<void> {
    await this.prisma.$transaction(async (trans) => {
      const now = new Date();
      const dados = this.toCartaoPrismaCreateFromCartaoInput(cartao, usuarioId);
      await trans.cartoes.upsert({
        where: { id: cartao.id, usuario_id: usuarioId },
        create: { ...dados, created_at: now },
        update: { ...dados, updated_at: now },
      });

      for (const fatura of cartao.faturas) {
        const dados = this.toFaturaPrismaCreateFromFaturaInput(fatura, cartao.id);
        await trans.faturas.upsert({
          where: {
            id_cartao_id: { id: fatura.id, cartao_id: cartao.id },
          },
          create: { ...dados, created_at: now },
          update: { ...dados, updated_at: now },
        });
      }
    });
  }
  async salvarTodos(usuarioId: string, cartoes: CartaoInputDTO[]): Promise<void> {
    await this.prisma.$transaction(async (trans) => {
      const now = new Date();
      for (const cartao of cartoes) {
        const dados = this.toCartaoPrismaCreateFromCartaoInput(cartao, usuarioId);
        await trans.cartoes.upsert({
          where: { id: cartao.id, usuario_id: usuarioId },
          create: { ...dados, created_at: now },
          update: { ...dados, updated_at: now },
        });
        for (const fatura of cartao.faturas) {
          const dados = this.toFaturaPrismaCreateFromFaturaInput(fatura, cartao.id);
          await trans.faturas.upsert({
            where: {
              id_cartao_id: { id: fatura.id, cartao_id: cartao.id },
            },
            create: { ...dados, created_at: now },
            update: { ...dados, updated_at: now },
          });
        }
      }
    });
  }
  async consultar(usuarioId: string): Promise<CartaoOutputDTO[]> {
    const consultaDb: CartaoPrismaSchema[] = await this.prisma.cartoes.findMany({
      where: {
        usuario_id: usuarioId,
        deleted_at: null,
      },
      include: {
        faturas: {
          where: { deleted_at: null },
        },
      },
    });
    const cartoesOutput = consultaDb.map((c: CartaoPrismaSchema) =>
      this.toCartaoOutputFromCartaoSchema(c),
    );

    return cartoesOutput;
  }
  async excluir(usuarioId: string, cartaoId: string): Promise<void> {
    const now = new Date();
    await this.prisma.$transaction([
      this.prisma.cartoes.update({
        where: {
          id: cartaoId,
          usuario_id: usuarioId,
        },
        data: { deleted_at: now },
      }),
      this.prisma.faturas.updateMany({
        where: {
          cartao_id: cartaoId,
          deleted_at: null,
        },
        data: { deleted_at: now },
      }),
    ]);
  }
  private toCartaoPrismaCreateFromCartaoInput(
    cartao: CartaoInputDTO,
    usuarioId: string,
  ): CartaoPrismaCreate {
    return {
      id: cartao.id,
      usuario_id: usuarioId,
      descricao: cartao.descricao,
      bandeira: cartao.bandeira,
      cor: cartao.cor,
    };
  }
  private toCartaoOutputFromCartaoSchema(cartaoSchema: CartaoPrismaSchema): CartaoOutputDTO {
    return {
      id: cartaoSchema.id,
      descricao: cartaoSchema.descricao,
      cor: cartaoSchema.cor,
      bandeira: cartaoSchema.bandeira,
      faturas: cartaoSchema.faturas.map((f: FaturaPrismaSchema) =>
        this.toFaturaOutputFromFaturaPrismaSchema(f),
      ),
    };
  }
  private toFaturaPrismaCreateFromFaturaInput(
    fatura: FaturaInputDTO,
    cartaoId: string,
  ): FaturaPrismaCreate {
    return {
      id: fatura.id,
      cartao_id: cartaoId,
      data: fatura.data,
      valor: fatura.valor,
      valor_planejado: fatura.valorPlanejado,
    };
  }

  private toFaturaOutputFromFaturaPrismaSchema(fatura: FaturaPrismaSchema): FaturaOutputDTO {
    return {
      id: fatura.id,
      data: fatura.data,
      valor: parseFloat(fatura.valor.toString()),
      valorPlanejado: parseFloat(fatura.valor_planejado.toString()),
    };
  }
}
