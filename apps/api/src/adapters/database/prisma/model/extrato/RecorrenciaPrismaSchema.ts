import { Prisma } from "@prisma/client";

export type RecorrenciaPrismaSchema = Prisma.recorrenciasGetPayload<{
  include: { transacoes_base: true };
}>;
