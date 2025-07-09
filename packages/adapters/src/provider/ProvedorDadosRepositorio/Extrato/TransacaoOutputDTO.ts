import { ValoresDetalhadosOutputDTO } from "./ValoresDetalhadosOutputDTO";

export interface TransacaoOutputDTO {
  id: string;
  contaId: string | null;
  cartaoId: string | null;
  categoriaId: string | null;
  nome: string;
  valor: number;
  data: Date;
  consolidada: boolean;
  operacao: string;
  observacoes: string | null;
  numeroParcela: number | null;
  recorrenciaId: string | null;
  valoresDetalhados: ValoresDetalhadosOutputDTO[];
}
