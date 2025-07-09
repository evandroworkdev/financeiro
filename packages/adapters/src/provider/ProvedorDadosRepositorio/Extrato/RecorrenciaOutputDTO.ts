import { TransacaoBaseOutputDTO } from "./TransacaoBaseOutputDTO";

export interface RecorrenciaOutputDTO {
  id: string;
  iniciarNaParcela: number;
  dataFim: Date | null;
  indefinida: boolean;
  qtdeDeParcelas: number | null;
  transacao: TransacaoBaseOutputDTO | null;
}
