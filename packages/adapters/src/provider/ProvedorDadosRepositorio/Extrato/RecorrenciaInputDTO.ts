import { TransacaoBaseInputDTO } from "./TransacaoBaseInputDTO";

export interface RecorrenciaInputDTO {
  id: string;
  usuarioId: string;
  iniciarNaParcela: number;
  dataFim: Date | null;
  indefinida: boolean;
  qtdeDeParcelas: number | null;
  transacao: TransacaoBaseInputDTO;
}
