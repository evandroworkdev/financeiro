import { TransacaoOutputDTO } from "./TransacaoOutputDTO";

export interface RecorrenciaOutputDTO {
  id: string;
  iniciarNaParcela: number;
  dataFim: Date | null;
  indefinida: boolean;
  qtdeDeParcelas: number | null;
  transacao: TransacaoOutputDTO | null;
}
