import { ValoresDetalhadosBaseOutputDTO } from "./ValoresDetalhadosBaseOutputDTO";

export interface TransacaoBaseOutputDTO {
  id: string;
  contaId: string | null;
  cartaoId: string | null;
  categoriaId: string | null;
  recorrenciaId: string | null;
  numeroParcela: number | null;
  nome: string;
  valor: number;
  data: Date;
  consolidada: boolean;
  operacao: string;
  observacoes: string | null;
  valoresDetalhados: ValoresDetalhadosBaseOutputDTO[];
}
