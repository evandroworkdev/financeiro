import { SaldoOutputDTO } from "./SaldoOutputDTO";

export interface ContaOutputDTO {
  id: string;
  descricao: string;
  banco: string;
  cor: string | null;
  saldos: SaldoOutputDTO[];
}
