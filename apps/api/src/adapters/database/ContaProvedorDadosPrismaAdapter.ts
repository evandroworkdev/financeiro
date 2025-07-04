import { PrismaClient } from "@prisma/client";
import {
  ProvedorDadosConta,
  ContaInputDTO,
  ContaOutputDTO,
  SaldoInputDTO,
  SaldoOutputDTO,
} from "adapters";
import { SaldoPrismaCreate } from "./prisma/model/conta/SaldoPrismaCreate";
import { SaldoPrismaSchema } from "./prisma/model/conta/SaldoPrismaSchema";

import { ContaPrismaCreate } from "./prisma/model/conta/ContaPrismaCreate";
import { ContaPrismaSchema } from "./prisma/model/conta/ContaPrismaSchema";

export default class ContaProvedorDadosPrismaAdapter implements ProvedorDadosConta {
  constructor(private readonly prisma: PrismaClient) {}

  async salvar(usuarioId: string, conta: ContaInputDTO): Promise<void> {
    await this.prisma.$transaction(async (trans) => {
      const dados = this.toContaPrismaCreateFromContaInput(conta, usuarioId);
      await trans.contas.upsert({
        where: { id: conta.id, usuario_id: usuarioId },
        update: { ...dados, updated_at: new Date() },
        create: { ...dados, updated_at: new Date() },
      });

      for (const saldo of conta.saldos) {
        await trans.saldos.upsert({
          where: {
            id_conta_id: { id: saldo.id, conta_id: conta.id },
          },
          update: this.toSaldoPrismaCreateFromSaldoInput(saldo, conta.id),
          create: this.toSaldoPrismaCreateFromSaldoInput(saldo, conta.id),
        });
      }
    });
  }
  async salvarTodas(usuarioId: string, contas: ContaInputDTO[]): Promise<void> {
    await this.prisma.$transaction(async (trans) => {
      for (const conta of contas) {
        await trans.contas.upsert({
          where: { id: conta.id, usuario_id: usuarioId },
          update: this.toContaPrismaCreateFromContaInput(conta, usuarioId),
          create: this.toContaPrismaCreateFromContaInput(conta, usuarioId),
        });

        for (const saldo of conta.saldos) {
          await trans.saldos.upsert({
            where: {
              id_conta_id: { id: saldo.id, conta_id: conta.id },
            },
            update: this.toSaldoPrismaCreateFromSaldoInput(saldo, conta.id),
            create: this.toSaldoPrismaCreateFromSaldoInput(saldo, conta.id),
          });
        }
      }
    });
  }
  async consultar(usuarioId: string): Promise<ContaOutputDTO[]> {
    const consultaDb: ContaPrismaSchema[] = await this.prisma.contas.findMany({
      where: {
        usuario_id: usuarioId,
        deleted_at: null,
      },
      include: { saldos: true },
    });

    const contasOutput = consultaDb.map((c: ContaPrismaSchema) =>
      this.toContaOutputFromContaSchema(c),
    );

    return contasOutput;
  }

  async excluir(usuarioId: string, contaId: string): Promise<void> {
    await this.prisma.contas.update({
      where: {
        id: contaId,
        usuario_id: usuarioId,
      },
      data: { deleted_at: new Date() },
    });
  }

  private toContaPrismaCreateFromContaInput(
    conta: ContaInputDTO,
    usuarioId: string,
  ): ContaPrismaCreate {
    return {
      id: conta.id,
      usuario_id: usuarioId,
      descricao: conta.descricao,
      banco: conta.banco,
      cor: conta.cor,
    };
  }

  private toContaOutputFromContaSchema(contaSchema: ContaPrismaSchema): ContaOutputDTO {
    return {
      id: contaSchema.id,
      descricao: contaSchema.descricao,
      banco: contaSchema.banco,
      cor: contaSchema.cor,
      saldos: contaSchema.saldos.map((saldo: SaldoPrismaSchema) =>
        this.toSaldoOutputFromSaldoPrismaSchema(saldo),
      ),
    };
  }
  private toSaldoPrismaCreateFromSaldoInput(
    saldo: SaldoInputDTO,
    contaId: string,
  ): SaldoPrismaCreate {
    return {
      id: saldo.id,
      conta_id: contaId,
      data: saldo.data,
      acumulado: saldo.acumulado,
      creditos: saldo.creditos,
      debitos: saldo.debitos,
    };
  }

  private toSaldoOutputFromSaldoPrismaSchema(saldo: SaldoPrismaSchema): SaldoOutputDTO {
    return {
      id: saldo.id,
      data: saldo.data,
      acumulado: parseFloat(saldo.acumulado.toString()),
      creditos: parseFloat(saldo.creditos.toString()),
      debitos: parseFloat(saldo.debitos.toString()),
    };
  }
}
