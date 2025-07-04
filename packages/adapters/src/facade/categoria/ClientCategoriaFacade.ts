import { CategoriaDTO } from "../../dto";
import { Categoria, FiltrarCategorias } from "core";

export default class ClientCategoriaFacade {
  filtrar(pesquisa: string, categoriasAgrupadas: CategoriaDTO[]): CategoriaDTO[] {
    const criarCategorias = Categoria.novas(categoriasAgrupadas);
    if (criarCategorias.deuErrado) criarCategorias.lancarErrorSeDeuErrado();
    const filtradas = new FiltrarCategorias(criarCategorias.instancia).filtrar(pesquisa);
    return filtradas.map((cat) => cat.props);
  }
}
