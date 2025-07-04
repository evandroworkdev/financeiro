export interface SaldoPrismaCreate {
  id: string;
  conta_id: string;
  data: Date;
  acumulado: number;
  creditos: number;
  debitos: number;
}
