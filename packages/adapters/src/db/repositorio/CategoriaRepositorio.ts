import { Categoria, CategoriaProps, Id, RepositorioCategoria, Resultado, Usuario } from "core";
import { CategoriaInputDTO, CategoriaOutputDTO, ProvedorDadosCategoria } from "../../provider";

export default class CategoriaRepositorio implements RepositorioCategoria {
  constructor(private readonly categoriaProvedorDados: ProvedorDadosCategoria) {}

  async salvar(usuario: Usuario, categoria: Categoria): Promise<Resultado<void>> {
    const dados = this.toCategoriaInputFromCategoria(categoria, usuario);
    await this.categoriaProvedorDados.salvar(usuario.id.valor, dados);
    return Resultado.ok();
  }
  async salvarTodas(usuario: Usuario, categorias: Categoria[]): Promise<Resultado<void>> {
    const usuarioId = usuario.id.valor;
    const dados = categorias.map((categoria) =>
      this.toCategoriaInputFromCategoria(categoria, usuario),
    );
    await this.categoriaProvedorDados.salvarTodas(usuario.id.valor, dados);
    return Resultado.ok();
  }
  async consultar(usuario: Usuario): Promise<Resultado<Categoria[]>> {
    const usuarioId = usuario.id.valor;
    const resultado = await this.categoriaProvedorDados.consultar(usuarioId);
    const dados = resultado.map((categoria: CategoriaOutputDTO) =>
      this.toCategoriaPropsFromCategoriaOutput(categoria),
    );
    return Categoria.novas(dados);
  }
  async excluir(usuario: Usuario, categoriaId: Id): Promise<Resultado<void>> {
    await this.categoriaProvedorDados.excluir(usuario.id.valor, categoriaId.valor);
    return Resultado.ok();
  }

  private toCategoriaInputFromCategoria(categoria: Categoria, usuario: Usuario): CategoriaInputDTO {
    return {
      id: categoria.id.valor,
      nome: categoria.nome.valor,
      idPai: categoria.idPai?.valor ?? null,
      usuarioId: usuario.id.valor,
    };
  }
  private toCategoriaPropsFromCategoriaOutput(
    categoriaOutputDTO: CategoriaOutputDTO,
  ): CategoriaProps {
    return {
      id: categoriaOutputDTO.id,
      nome: categoriaOutputDTO.nome,
      idPai: categoriaOutputDTO.idPai,
    };
  }
}
