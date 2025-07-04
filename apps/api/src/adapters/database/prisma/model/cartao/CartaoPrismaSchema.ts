import { Prisma } from "@prisma/client";

export type CartaoPrismaSchema = Prisma.cartoesGetPayload<{
  include: { faturas: true };
}>;
