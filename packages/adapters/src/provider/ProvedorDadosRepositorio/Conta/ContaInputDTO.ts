import { SaldoInputDTO } from "./SaldoInputDTO";

export interface ContaInputDTO {
  id: string;
  usuarioId: string;
  descricao: string;
  banco: string;
  cor: string | null;
  saldos: SaldoInputDTO[];
}
