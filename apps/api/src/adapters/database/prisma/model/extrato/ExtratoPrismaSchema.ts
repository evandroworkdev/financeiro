import { Prisma } from "@prisma/client";

export type ExtratoPrismaSchema = Prisma.extratosGetPayload<{
  include: {
    transacoes: {
      include: {
        valores_detalhados: true;
      };
    };
  };
}>;
