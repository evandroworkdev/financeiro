import { Prisma, valores_detalhados } from "@prisma/client";

export type TransacaoPrismaSchema = Prisma.transacoesGetPayload<{
  include: { valores_detalhados: true };
}>;
