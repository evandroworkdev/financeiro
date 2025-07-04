// export interface SaldoPrismaSchema {
//   id: string;
//   conta_id: string;
//   data: Date;
//   acumulado: number;
//   creditos: number;
//   debitos: number;
//   created_at?: Date | null;
//   updated_at?: Date | null;
//   deleted_at?: Date | null;
// }

import { Prisma } from "@prisma/client";

export type SaldoPrismaSchema = Prisma.saldosGetPayload<{}>;
