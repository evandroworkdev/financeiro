import { PrismaClient } from "@prisma/client";
import {
  ExtratoInputDTO,
  ExtratoOutputDTO,
  ProvedorDadosExtrato,
  RecorrenciaInputDTO,
  RecorrenciaOutputDTO,
  TransacaoBaseInputDTO,
  TransacaoBaseOutputDTO,
  TransacaoInputDTO,
  TransacaoOutputDTO,
  ValoresDetalhadosBaseInputDTO,
  ValoresDetalhadosBaseOutputDTO,
  ValoresDetalhadosInputDTO,
  ValoresDetalhadosOutputDTO,
} from "adapters";
import { fn, IdUnico } from "utils";
import { ExtratoPrismaCreate } from "./prisma/model/extrato/ExtratoPrismaCreate";
import { ExtratoPrismaSchema } from "./prisma/model/extrato/ExtratoPrismaSchema";
import { RecorrenciaPrismaCreate } from "./prisma/model/extrato/RecorrenciaPrismaCreate";
import { RecorrenciaPrismaSchema } from "./prisma/model/extrato/RecorrenciaPrismaSchema";
import { TransacaoPrismaCreate } from "./prisma/model/extrato/TransacaoPrismaCreate";
import { TransacaoPrismaSchema } from "./prisma/model/extrato/TransacaoPrismaSchema";
import { TransacaoBasePrismaCreate } from "./prisma/model/extrato/TransacaoBasePrismaCreate";
import { TransacaoBasePrismaSchema } from "./prisma/model/extrato/TransacaoBasePrismaSchema";
import { ValoresDetalhadosBasePrismaSchema } from "./prisma/model/extrato/ValoresDetalhadosBasePrismaSchema";
import { ValoresDetalhadosBasePrismaCreate } from "./prisma/model/extrato/ValoresDetalhadosBasePrismaCreate";
import { ValoresDetalhadosPrismaSchema } from "./prisma/model/extrato/ValoresDetalhadosPrismaSchema";
import { ValoresDetalhadosPrismaCreate } from "./prisma/model/extrato/ValoresDetalhadosPrismaCreate";

export default class ExtratoProvedorDadosPrismaAdapter implements ProvedorDadosExtrato {
  constructor(private readonly prisma: PrismaClient) {}

  async salvar(usuarioId: string, extrato: ExtratoInputDTO): Promise<void> {
    await this.prisma.$transaction(async (trans) => {
      const now = new Date();
      const dados = this.toExtratoPrismaCreateFromExtratoInput(extrato, usuarioId);
      await trans.extratos.upsert({
        where: {
          id_usuario_id: {
            id: extrato.id,
            usuario_id: usuarioId,
          },
        },
        create: { ...dados, created_at: now },
        update: { ...dados, updated_at: now },
      });
      for (const transacao of extrato.transacoes) {
        const dados = this.toTransacaoPrismaCreateFromTransacaoInput(
          transacao,
          usuarioId,
          extrato.id,
        );
        await trans.transacoes.upsert({
          where: { id: transacao.id },
          create: { ...dados, created_at: now },
          update: { ...dados, updated_at: now },
        });
        await trans.valores_detalhados.deleteMany({
          where: { transacao_id: transacao.id },
        });
        for (const valoresDetalhado of transacao.valoresDetalhados) {
          const dados = this.toValoresDetalhadosPrismaCreateFromValoresDetalhadosInput(
            valoresDetalhado,
            transacao.id,
          );
          await trans.valores_detalhados.create({
            data: { ...dados, created_at: now },
          });
        }
      }
      for (const idTransacaoRemovida of extrato.transacoesRemovidas) {
        await trans.transacoes.delete({
          where: { id: idTransacaoRemovida },
        });
      }
    });
  }
  async salvarTodos(usuarioId: string, extratos: ExtratoInputDTO[]): Promise<void> {
    await this.prisma.$transaction(async (trans) => {
      for (const extrato of extratos) {
        const now = new Date();
        const dados = this.toExtratoPrismaCreateFromExtratoInput(extrato, usuarioId);
        await trans.extratos.upsert({
          where: {
            id_usuario_id: {
              id: extrato.id,
              usuario_id: usuarioId,
            },
          },
          create: { ...dados, created_at: now },
          update: { ...dados, updated_at: now },
        });

        for (const transacao of extrato.transacoes) {
          const dados = this.toTransacaoPrismaCreateFromTransacaoInput(
            transacao,
            usuarioId,
            extrato.id,
          );
          await trans.transacoes.upsert({
            where: { id: transacao.id },
            create: { ...dados, created_at: now },
            update: { ...dados, updated_at: now },
          });

          await trans.valores_detalhados.deleteMany({
            where: { transacao_id: transacao.id },
          });
          for (const valoresDetalhado of transacao.valoresDetalhados) {
            const dados = this.toValoresDetalhadosPrismaCreateFromValoresDetalhadosInput(
              valoresDetalhado,
              transacao.id,
            );
            await trans.valores_detalhados.create({
              data: { ...dados, created_at: now },
            });
          }
        }
        for (const idTransacaoRemovida of extrato.transacoesRemovidas) {
          await trans.transacoes.delete({
            where: { id: idTransacaoRemovida },
          });
        }
      }
    });
  }
  async salvarRecorrencia(
    usuarioId: string,
    extratos: ExtratoInputDTO[],
    recorrencia: RecorrenciaInputDTO,
  ): Promise<void> {
    await this.prisma.$transaction(async (trans) => {
      const now = new Date();
      const dadosRecorrencia = this.toRecorrenciaPrismaCreateFromRecorrenciaInput(
        recorrencia,
        usuarioId,
      );
      await trans.recorrencias.upsert({
        where: { id: recorrencia.id },
        create: { ...dadosRecorrencia, created_at: now },
        update: { ...dadosRecorrencia, updated_at: now },
      });

      const dadosTransacaoBase = this.toTransacaoBasePrismaCreateFromTransacaoBaseInput(
        recorrencia.transacao,
        usuarioId,
      );
      await trans.transacoes_base.upsert({
        where: { recorrencia_id: recorrencia.id },
        create: { ...dadosTransacaoBase, created_at: now },
        update: { ...dadosTransacaoBase, updated_at: now },
      });
      await trans.valores_detalhados_base.deleteMany({
        where: { transacao_base_id: recorrencia.transacao.id },
      });
      for (const valoresDetalhadoBase of recorrencia.transacao.valoresDetalhados) {
        const dados = this.toValoresDetalhadosBasePrismaCreateFromValoresDetalhadosBaseInput(
          valoresDetalhadoBase,
          recorrencia.transacao.id,
        );
        await trans.valores_detalhados_base.create({
          data: { ...dados, created_at: now },
        });
      }

      for (const extrato of extratos) {
        const dadosExtrato = this.toExtratoPrismaCreateFromExtratoInput(extrato, usuarioId);
        await trans.extratos.upsert({
          where: {
            id_usuario_id: {
              id: extrato.id,
              usuario_id: usuarioId,
            },
          },
          create: { ...dadosExtrato, created_at: now },
          update: { ...dadosExtrato, updated_at: now },
        });
        for (const transacao of extrato.transacoes) {
          const dadosTransacao = this.toTransacaoPrismaCreateFromTransacaoInput(
            transacao,
            usuarioId,
            extrato.id,
          );
          await trans.transacoes.upsert({
            where: { id: transacao.id },
            create: { ...dadosTransacao, created_at: now },
            update: { ...dadosTransacao, updated_at: now },
          });
          await trans.valores_detalhados.deleteMany({
            where: { transacao_id: transacao.id },
          });
          for (const valoresDetalhado of transacao.valoresDetalhados) {
            const dados = this.toValoresDetalhadosPrismaCreateFromValoresDetalhadosInput(
              valoresDetalhado,
              transacao.id,
            );
            await trans.valores_detalhados.create({
              data: { ...dados, created_at: now },
            });
          }
        }
        for (const idTransacaoRemovida of extrato.transacoesRemovidas) {
          await trans.transacoes.delete({
            where: { id: idTransacaoRemovida },
          });
        }
      }
    });
  }
  async consultar(usuarioId: string): Promise<ExtratoOutputDTO[]> {
    const consultaDb: ExtratoPrismaSchema[] = await this.prisma.extratos.findMany({
      where: {
        usuario_id: usuarioId,
        deleted_at: null,
      },
      include: {
        transacoes: {
          where: {
            deleted_at: null,
          },
          include: { valores_detalhados: true },
        },
      },
    });
    const extratosOutput = consultaDb.map((extrato: ExtratoPrismaSchema) =>
      this.toExtratoOutputFromExtratoSchema(extrato),
    );
    return extratosOutput;
  }
  async consultarPorId(usuarioId: string, id: string): Promise<ExtratoOutputDTO | null> {
    const consultaDb = await this.prisma.extratos.findUnique({
      where: {
        id_usuario_id: { id: id, usuario_id: usuarioId },
        deleted_at: null,
      },
      include: {
        transacoes: {
          where: {
            deleted_at: null,
          },
          include: { valores_detalhados: true },
        },
      },
    });
    if (!consultaDb) return null;
    const extratoOutputDTO = this.toExtratoOutputFromExtratoSchema(consultaDb);
    return extratoOutputDTO;
  }
  async consultarPorIds(usuarioId: string, ids: string[]): Promise<ExtratoOutputDTO[]> {
    const idsValor = ids.map((id) => id);
    const extratosDb = await this.prisma.extratos.findMany({
      where: {
        usuario_id: usuarioId,
        id: {
          in: idsValor,
        },
        deleted_at: null,
      },
      include: {
        transacoes: {
          where: {
            deleted_at: null,
          },
          include: { valores_detalhados: true },
        },
      },
    });
    const extratosOutput = extratosDb.map((extrato: ExtratoPrismaSchema) =>
      this.toExtratoOutputFromExtratoSchema(extrato),
    );
    return extratosOutput;
  }
  async consultarRecorrenciasPorMes(
    usuarioId: string,
    data: Date,
  ): Promise<RecorrenciaOutputDTO[]> {
    const ultimoDiaDoMes = fn.dt.ultimoDiaDoMes(data);

    const recorrenciasDb = await this.prisma.recorrencias.findMany({
      where: {
        deleted_at: null,
        usuario_id: usuarioId,
        transacoes_base: {
          is: {
            data: {
              lte: ultimoDiaDoMes,
            },
          },
        },
      },
      include: {
        transacoes_base: {
          where: {
            deleted_at: null,
          },
          include: { valores_detalhados_base: true },
        },
      },
    });

    const recorrenciasOutput = recorrenciasDb.map((r: RecorrenciaPrismaSchema) =>
      this.toRecorrenciaOutputFromRecorrenciaSchema(r),
    );
    return recorrenciasOutput;
  }
  async consultarRecorrenciaPorId(
    usuarioId: string,
    id: string,
  ): Promise<RecorrenciaOutputDTO | null> {
    const recorrenciaBd = await this.prisma.recorrencias.findUnique({
      where: { deleted_at: null, id: id, usuario_id: usuarioId },
      include: {
        transacoes_base: {
          where: {
            deleted_at: null,
          },
          include: { valores_detalhados_base: true },
        },
      },
    });
    if (!recorrenciaBd) return null;
    const recorrenciaOutput = this.toRecorrenciaOutputFromRecorrenciaSchema(recorrenciaBd);
    return recorrenciaOutput;
  }
  async consultarRecorrencias(usuarioId: string): Promise<RecorrenciaOutputDTO[]> {
    const recorrenciasBd = await this.prisma.recorrencias.findMany({
      where: { deleted_at: null, usuario_id: usuarioId },
      include: {
        transacoes_base: {
          where: {
            deleted_at: null,
          },
          include: { valores_detalhados_base: true },
        },
      },
    });
    const recorrenciasOutput = recorrenciasBd.map((r: RecorrenciaPrismaSchema) =>
      this.toRecorrenciaOutputFromRecorrenciaSchema(r),
    );
    return recorrenciasOutput;
  }
  async excluirRecorrencia(
    usuarioId: string,
    extratos: ExtratoInputDTO[],
    recorrencia: RecorrenciaInputDTO,
  ): Promise<void> {
    await this.prisma.$transaction(async (trans) => {
      const now = new Date();

      await trans.recorrencias.update({
        where: { id: recorrencia.id, usuario_id: usuarioId },
        data: { deleted_at: now },
      });
      await trans.transacoes_base.update({
        where: { id: recorrencia.transacao.id, usuario_id: usuarioId },
        data: { deleted_at: now },
      });
      await trans.valores_detalhados_base.updateMany({
        where: { transacao_base_id: recorrencia.transacao.id },
        data: { deleted_at: now },
      });

      for (const extrato of extratos) {
        const dados = this.toExtratoPrismaCreateFromExtratoInput(extrato, usuarioId);
        await trans.extratos.upsert({
          where: {
            id_usuario_id: {
              id: extrato.id,
              usuario_id: usuarioId,
            },
          },
          create: { ...dados, created_at: now },
          update: { ...dados, updated_at: now },
        });

        for (const idTransacaoRemovida of extrato.transacoesRemovidas) {
          await trans.transacoes.update({
            where: { id: idTransacaoRemovida },
            data: { deleted_at: now },
          });
          await trans.valores_detalhados.updateMany({
            where: { transacao_id: idTransacaoRemovida },
            data: { deleted_at: now },
          });
        }

        for (const transacao of extrato.transacoes) {
          const dados = this.toTransacaoPrismaCreateFromTransacaoInput(
            transacao,
            usuarioId,
            extrato.id,
          );
          await trans.transacoes.upsert({
            where: { id: transacao.id, usuario_id: usuarioId },
            create: { ...dados, created_at: now },
            update: { ...dados, updated_at: now },
          });
        }
      }
    });
  }

  private toExtratoPrismaCreateFromExtratoInput(
    extrato: ExtratoInputDTO,
    usuarioId: string,
  ): ExtratoPrismaCreate {
    return {
      id: extrato.id,
      usuario_id: usuarioId,
      data: extrato.data,
      sumario_data: extrato.sumarioData,
      sumario_total: extrato.sumarioTotal,
      sumario_receitas: extrato.sumarioReceitas,
      sumario_despesas: extrato.sumarioDespesas,
    };
  }

  private toExtratoOutputFromExtratoSchema(extratoSchema: ExtratoPrismaSchema): ExtratoOutputDTO {
    return {
      id: extratoSchema.id,
      data: extratoSchema.data,
      sumario_data: extratoSchema.data,
      sumario_receitas: parseFloat(extratoSchema.sumario_receitas.toString()),
      sumario_despesas: parseFloat(extratoSchema.sumario_despesas.toString()),
      sumario_total: parseFloat(extratoSchema.sumario_total.toString()),
      transacoes: extratoSchema.transacoes.map((t: TransacaoPrismaSchema) =>
        this.toTransacaoOutputFromTransacaoSchema(t),
      ),
    };
  }
  private toRecorrenciaPrismaCreateFromRecorrenciaInput(
    recorrencia: RecorrenciaInputDTO,
    usuarioId: string,
  ): RecorrenciaPrismaCreate {
    return {
      id: recorrencia.id,
      usuario_id: usuarioId,
      data_fim: recorrencia.dataFim,
      indefinida: recorrencia.indefinida,
      iniciar_na_parcela: recorrencia.iniciarNaParcela,
      qtde_de_parcelas: recorrencia.qtdeDeParcelas,
    };
  }

  private toRecorrenciaOutputFromRecorrenciaSchema(
    recorrenciaSchema: RecorrenciaPrismaSchema,
  ): RecorrenciaOutputDTO {
    return {
      id: recorrenciaSchema.id,
      iniciarNaParcela: recorrenciaSchema.iniciar_na_parcela,
      qtdeDeParcelas: recorrenciaSchema.qtde_de_parcelas,
      dataFim: recorrenciaSchema.data_fim,
      indefinida: recorrenciaSchema.indefinida,
      transacao: recorrenciaSchema.transacoes_base
        ? this.toTransacaoBaseOutputFromTransacaoBaseSchema(recorrenciaSchema.transacoes_base)
        : null,
    };
  }
  private toTransacaoPrismaCreateFromTransacaoInput(
    transacao: TransacaoInputDTO,
    usuarioId: string,
    extratoId: string,
  ): TransacaoPrismaCreate {
    return {
      id: transacao.id,
      extrato_id: extratoId,
      extrato_usuario_id: usuarioId,
      recorrencia_id: transacao.recorrenciaId,
      usuario_id: usuarioId,
      conta_id: transacao.contaId,
      cartao_id: transacao.cartaoId,
      categoria_id: transacao.categoriaId,
      nome: transacao.nome,
      valor: transacao.valor,
      data: transacao.data,
      consolidada: transacao.consolidada,
      operacao: transacao.operacao,
      observacoes: transacao.observacoes,
      numero_parcela: transacao.numeroParcela,
    };
  }

  private toTransacaoOutputFromTransacaoSchema(
    transacaoSchema: TransacaoPrismaSchema,
  ): TransacaoOutputDTO {
    return {
      id: transacaoSchema.id,
      nome: transacaoSchema.nome,
      valor: parseFloat(transacaoSchema.valor.toString()),
      data: transacaoSchema.data,
      consolidada: transacaoSchema.consolidada,
      operacao: transacaoSchema.operacao,
      observacoes: transacaoSchema.observacoes,
      contaId: transacaoSchema.conta_id,
      cartaoId: transacaoSchema.cartao_id,
      categoriaId: transacaoSchema.categoria_id,
      numeroParcela: transacaoSchema.numero_parcela,
      recorrenciaId: transacaoSchema.recorrencia_id,
      valoresDetalhados: transacaoSchema.valores_detalhados.map(
        (vd: ValoresDetalhadosPrismaSchema) =>
          this.toValoresDetalhadosOutputFromValoresDetalhadosSchema(vd),
      ),
    };
  }
  private toTransacaoBasePrismaCreateFromTransacaoBaseInput(
    transacaoBase: TransacaoBaseInputDTO,
    usuarioId: string,
  ): TransacaoBasePrismaCreate {
    return {
      id: transacaoBase.id,
      recorrencia_id: transacaoBase.recorrenciaId,
      usuario_id: usuarioId,
      conta_id: transacaoBase.contaId,
      cartao_id: transacaoBase.cartaoId,
      categoria_id: transacaoBase.categoriaId,
      nome: transacaoBase.nome,
      valor: transacaoBase.valor,
      data: transacaoBase.data,
      consolidada: transacaoBase.consolidada,
      operacao: transacaoBase.operacao,
      observacoes: transacaoBase.observacoes,
      numero_parcela: transacaoBase.numeroParcela,
    };
  }

  private toTransacaoBaseOutputFromTransacaoBaseSchema(
    transacaoBaseSchema: TransacaoBasePrismaSchema,
  ): TransacaoBaseOutputDTO {
    return {
      id: transacaoBaseSchema.id,
      contaId: transacaoBaseSchema.conta_id,
      cartaoId: transacaoBaseSchema.cartao_id,
      categoriaId: transacaoBaseSchema.categoria_id,
      recorrenciaId: transacaoBaseSchema.recorrencia_id,
      numeroParcela: transacaoBaseSchema.numero_parcela,
      nome: transacaoBaseSchema.nome,
      valor: parseFloat(transacaoBaseSchema.valor.toString()),
      data: transacaoBaseSchema.data,
      consolidada: transacaoBaseSchema.consolidada,
      operacao: transacaoBaseSchema.operacao,
      observacoes: transacaoBaseSchema.observacoes,
      valoresDetalhados: transacaoBaseSchema.valores_detalhados_base.map((vd) =>
        this.toValoresDetalhadosBaseOutputFromValoresDetalhadosBaseSchema(vd),
      ),
    };
  }

  private toValoresDetalhadosPrismaCreateFromValoresDetalhadosInput(
    valoresDetalhados: ValoresDetalhadosInputDTO,
    transacaoId: string,
  ): ValoresDetalhadosPrismaCreate {
    return {
      id: IdUnico.gerar(),
      transacao_id: transacaoId,
      descricao: valoresDetalhados.descricao,
      valor: valoresDetalhados.valor,
      operacao: valoresDetalhados.operacao,
    };
  }

  private toValoresDetalhadosOutputFromValoresDetalhadosSchema(
    valoresDetalhadosSchema: ValoresDetalhadosPrismaSchema,
  ): ValoresDetalhadosOutputDTO {
    return {
      descricao: valoresDetalhadosSchema.descricao,
      valor: parseFloat(valoresDetalhadosSchema.valor.toString()),
      operacao: valoresDetalhadosSchema.operacao,
    };
  }

  private toValoresDetalhadosBasePrismaCreateFromValoresDetalhadosBaseInput(
    valoresDetalhadosBase: ValoresDetalhadosBaseInputDTO,
    transacaoBaseId: string,
  ): ValoresDetalhadosBasePrismaCreate {
    return {
      id: IdUnico.gerar(),
      transacao_base_id: transacaoBaseId,
      descricao: valoresDetalhadosBase.descricao,
      valor: valoresDetalhadosBase.valor,
      operacao: valoresDetalhadosBase.operacao,
    };
  }

  private toValoresDetalhadosBaseOutputFromValoresDetalhadosBaseSchema(
    valoresDetalhadosSchema: ValoresDetalhadosBasePrismaSchema,
  ): ValoresDetalhadosBaseOutputDTO {
    return {
      descricao: valoresDetalhadosSchema.descricao,
      valor: parseFloat(valoresDetalhadosSchema.valor.toString()),
      operacao: valoresDetalhadosSchema.operacao,
    };
  }
}
