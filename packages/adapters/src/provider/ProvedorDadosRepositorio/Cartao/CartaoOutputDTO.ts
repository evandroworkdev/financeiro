import { FaturaOutputDTO } from "./FaturaOutputDTO";

export interface CartaoOutputDTO {
  id: string;
  descricao: string;
  cor: string | null;
  bandeira: string;
  faturas: FaturaOutputDTO[];
}
