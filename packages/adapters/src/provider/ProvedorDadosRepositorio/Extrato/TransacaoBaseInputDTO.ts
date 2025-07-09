import { ValoresDetalhadosBaseInputDTO } from "./ValoresDetalhadosBaseInputDTO";

export interface TransacaoBaseInputDTO {
  id: string;
  usuarioId: string;
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
  observacoes: string;
  valoresDetalhados: ValoresDetalhadosBaseInputDTO[];
}
