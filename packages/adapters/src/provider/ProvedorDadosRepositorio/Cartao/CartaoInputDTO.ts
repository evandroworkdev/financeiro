import { FaturaInputDTO } from "./FaturaInputDTO";

export interface CartaoInputDTO {
  id: string;
  descricao: string;
  cor: string | null;
  bandeira: string;
  usuarioId: string;
  faturas: FaturaInputDTO[];
}
