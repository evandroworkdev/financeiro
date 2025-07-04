import {
  CartaoDTO,
  CategoriaDTO,
  ContaDTO,
  ExtratoDTO,
  FiltroExtratoDTO,
  TransacaoDTO,
} from "../../dto";
import {
  Cartao,
  Categoria,
  ConsultarFiltrosExtrato,
  Conta,
  Extrato,
  FiltrarExtrato,
  RelatorioEvolucaoRecorrencia,
} from "core";

export default class ClientExtratoFacade {
  async consultarFiltrosExtrato(
    cartoes: CartaoDTO[],
    categorias: CategoriaDTO[],
    contas: ContaDTO[],
  ): Promise<FiltroExtratoDTO[]> {
    const criarCartoes = Cartao.novos(cartoes);
    if (criarCartoes.deuErrado) criarCartoes.lancarErrorSeDeuErrado();

    const criarCategorias = Categoria.novas(categorias);
    if (criarCategorias.deuErrado) criarCategorias.lancarErrorSeDeuErrado();

    const criarContas = Conta.novas(contas);
    if (criarContas.deuErrado) criarContas.lancarErrorSeDeuErrado();

    const casoDeUso = new ConsultarFiltrosExtrato();
    const resultado = await casoDeUso.executar({
      cartoes: criarCartoes.instancia,
      categorias: criarCategorias.instancia,
      contas: criarContas.instancia,
    });
    if (resultado.deuErrado) resultado.lancarErrorSeDeuErrado();
    return resultado.instancia;
  }

  async filtarExtrato(extrato: ExtratoDTO, filtros: FiltroExtratoDTO[]): Promise<ExtratoDTO> {
    const criarExtrato = Extrato.novo(extrato);
    if (criarExtrato.deuErrado) criarExtrato.lancarErrorSeDeuErrado();

    const casoDeUso = new FiltrarExtrato();
    const resultado = await casoDeUso.executar({ extrato: criarExtrato.instancia, filtros });
    if (resultado.deuErrado) resultado.lancarErrorSeDeuErrado();
    return resultado.instancia.props;
  }

  async relatorioEvolucaoRecorrencia(
    extratos: ExtratoDTO[],
    recorrenciaId: string,
  ): Promise<TransacaoDTO[]> {
    const criarExtratos = Extrato.novos(extratos);
    if (criarExtratos.deuErrado) criarExtratos.lancarErrorSeDeuErrado();

    const dto = { extratos: criarExtratos.instancia, recorrenciaId };
    const casoDeUso = new RelatorioEvolucaoRecorrencia();
    const resultado = await casoDeUso.executar(dto);
    if (resultado.deuErrado) resultado.lancarErrorSeDeuErrado();
    return resultado.instancia.map((t) => t.props);
  }
}
