import {
  Cartao,
  CartaoProps,
  Fatura,
  FaturaProps,
  Id,
  RepositorioCartao,
  Resultado,
  Usuario,
} from "core";
import {
  CartaoInputDTO,
  CartaoOutputDTO,
  FaturaInputDTO,
  FaturaOutputDTO,
  ProvedorDadosCartao,
} from "../../provider";

export default class CartaoRepositorio implements RepositorioCartao {
  constructor(private readonly cartaoProvedorDados: ProvedorDadosCartao) {}

  async salvar(usuario: Usuario, cartao: Cartao): Promise<Resultado<void>> {
    const dados = this.toCartaoInputFromCartao(cartao, usuario);
    await this.cartaoProvedorDados.salvar(usuario.id.valor, dados);
    return Resultado.ok();
  }
  async salvarTodos(usuario: Usuario, cartoes: Cartao[]): Promise<Resultado<void>> {
    const usuarioId = usuario.id.valor;
    const dados = cartoes.map((cartao) => this.toCartaoInputFromCartao(cartao, usuario));
    await this.cartaoProvedorDados.salvarTodos(usuario.id.valor, dados);
    return Resultado.ok();
  }
  async consultar(usuario: Usuario): Promise<Resultado<Cartao[]>> {
    const usuarioId = usuario.id.valor;
    const resultado = await this.cartaoProvedorDados.consultar(usuarioId);
    const dados = resultado.map((cartao) => this.toCartaoPropsFromCartaoOutput(cartao));
    return Cartao.novos(dados);
  }
  async excluir(usuario: Usuario, cartaoId: Id): Promise<Resultado<void>> {
    await this.cartaoProvedorDados.excluir(usuario.id.valor, cartaoId.valor);
    return Resultado.ok();
  }

  private toCartaoInputFromCartao(cartao: Cartao, usuario: Usuario): CartaoInputDTO {
    return {
      id: cartao.id.valor,
      descricao: cartao.descricao.valor,
      cor: cartao.cor?.valor ?? null,
      bandeira: cartao.bandeira.valor,
      usuarioId: usuario.id.valor,
      faturas: cartao.faturas.map((fatura) => this.toFaturaInputFromFatura(fatura, cartao)),
    };
  }
  private toCartaoPropsFromCartaoOutput(cartaoOutputDTO: CartaoOutputDTO): CartaoProps {
    return {
      id: cartaoOutputDTO.id,
      descricao: cartaoOutputDTO.descricao,
      cor: cartaoOutputDTO.cor ?? undefined,
      bandeira: cartaoOutputDTO.bandeira,
      faturas: cartaoOutputDTO.faturas.map((f: FaturaOutputDTO) =>
        this.toFaturaPropsFromFaturaOutput(f),
      ),
    };
  }

  private toFaturaInputFromFatura(fatura: Fatura, cartao: Cartao): FaturaInputDTO {
    return {
      id: fatura.id.valor,
      cartaoId: cartao.id.valor,
      data: fatura.data,
      valor: fatura.valor,
      valorPlanejado: fatura.valorPlanejado,
    };
  }

  private toFaturaPropsFromFaturaOutput(fatura: FaturaOutputDTO): FaturaProps {
    return {
      id: fatura.id,
      data: fatura.data,
      valor: fatura.valor,
      valorPlanejado: fatura.valorPlanejado,
    };
  }
}
