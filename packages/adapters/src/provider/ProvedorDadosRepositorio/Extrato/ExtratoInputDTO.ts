import { TransacaoInputDTO } from "./TransacaoInputDTO";

export interface ExtratoInputDTO {
  id: string;
  usuarioId: string;
  data: Date;
  sumarioData: Date;
  sumarioReceitas: number;
  sumarioDespesas: number;
  sumarioTotal: number;
  transacoesRemovidas: string[];
  transacoes: TransacaoInputDTO[];
}
