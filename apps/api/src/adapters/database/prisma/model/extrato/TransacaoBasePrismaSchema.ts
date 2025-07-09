import { Prisma } from "@prisma/client";

export type TransacaoBasePrismaSchema = Prisma.transacoes_baseGetPayload<{
  include: { valores_detalhados_base: true };
}>;
