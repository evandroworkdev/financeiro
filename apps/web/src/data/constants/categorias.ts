import { CategoriaDTO } from "adapters";
import { IdUnico } from "utils";

const casa = { id: IdUnico.gerar(), nome: "Casa" };
const alimentacao = { id: IdUnico.gerar(), nome: "Alimentação" };

const categorias = [
  casa,
  { id: IdUnico.gerar(), nome: "Água", idPai: casa.id },
  { id: IdUnico.gerar(), nome: "Aluguel", idPai: casa.id },

  alimentacao,
  { id: IdUnico.gerar(), nome: "Supermercado", idPai: alimentacao.id },
  { id: IdUnico.gerar(), nome: "Lanches", idPai: alimentacao.id },
] as CategoriaDTO[];

export default categorias;
