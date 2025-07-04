import { TransacaoOutputDTO } from "./TransacaoOutputDTO";

export interface ExtratoOutputDTO {
  id: string;
  data: Date;
  sumario_data: Date;
  sumario_receitas: number;
  sumario_despesas: number;
  sumario_total: number;
  transacoes: TransacaoOutputDTO[];
}
