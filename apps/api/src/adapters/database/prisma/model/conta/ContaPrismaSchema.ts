import { Prisma } from "@prisma/client";
import { SaldoPrismaSchema } from "./SaldoPrismaSchema";

// export interface ContaPrismaSchema {
//   id: string;
//   usuario_id: string | null;
//   descricao: string;
//   banco: string;
//   cor: string | null;
//   saldos: SaldoPrismaSchema[];
//   created_at?: Date | null;
//   updated_at?: Date | null;
//   deleted_at?: Date | null;
// }

export type ContaPrismaSchema = Prisma.contasGetPayload<{
  include: { saldos: true };
}>;
