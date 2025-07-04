import { Prisma } from "@prisma/client";

export type ExtratoPrismaSchema = Prisma.extratosGetPayload<{ include: { transacoes: true } }>;
