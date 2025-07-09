import { ValoresDetalhadosInputDTO } from "./ValoresDetalhadosInputDTO";

export interface TransacaoInputDTO {
  id: string;
  usuarioId: string;
  extratoUsuarioId: string;
  extratoId: string;
  nome: string;
  valor: number;
  data: Date;
  consolidada: boolean;
  operacao: string;
  observacoes: string;
  contaId: string | null;
  cartaoId: string | null;
  categoriaId: string | null;
  recorrenciaId: string | null;
  numeroParcela: number | null;
  valoresDetalhados: ValoresDetalhadosInputDTO[];
}
