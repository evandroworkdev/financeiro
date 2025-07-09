import { Prisma } from "@prisma/client";

export type RecorrenciaPrismaSchema = Prisma.recorrenciasGetPayload<{
  include: {
    transacoes_base: {
      include: {
        valores_detalhados_base: true;
      };
    };
  };
}>;
