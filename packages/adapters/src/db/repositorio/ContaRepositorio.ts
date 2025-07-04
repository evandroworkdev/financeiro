import {
  Conta,
  ContaProps,
  Id,
  RepositorioConta,
  Resultado,
  Saldo,
  SaldoProps,
  Usuario,
} from "core";
import {
  ContaInputDTO,
  ContaOutputDTO,
  ProvedorDadosConta,
  SaldoInputDTO,
  SaldoOutputDTO,
} from "../../provider";

export default class ContaRepositorio implements RepositorioConta {
  constructor(private readonly contaProvedorDados: ProvedorDadosConta) {}

  async salvar(usuario: Usuario, conta: Conta): Promise<Resultado<void>> {
    const dados = this.toContaInputFromConta(conta, usuario);
    await this.contaProvedorDados.salvar(usuario.id.valor, dados);
    return Resultado.ok();
  }
  async salvarTodas(usuario: Usuario, contas: Conta[]): Promise<Resultado<void>> {
    const usuarioId = usuario.id.valor;
    const dados = contas.map((conta) => this.toContaInputFromConta(conta, usuario));
    await this.contaProvedorDados.salvarTodas(usuario.id.valor, dados);
    return Resultado.ok();
  }
  async consultar(usuario: Usuario): Promise<Resultado<Conta[]>> {
    const usuarioId = usuario.id.valor;
    const resultado = await this.contaProvedorDados.consultar(usuarioId);
    const dados = resultado.map((conta: ContaOutputDTO) => this.toContaPropsFromContaOutput(conta));
    return Conta.novas(dados);
  }
  async excluir(usuario: Usuario, contaId: Id): Promise<Resultado<void>> {
    await this.contaProvedorDados.excluir(usuario.id.valor, contaId.valor);
    return Resultado.ok();
  }

  private toContaInputFromConta(conta: Conta, usuario: Usuario): ContaInputDTO {
    return {
      id: conta.id.valor,
      usuarioId: usuario.id.valor,
      descricao: conta.descricao.valor,
      banco: conta.banco.valor,
      cor: conta.cor?.valor ?? null,
      saldos: conta.saldos.map((saldo: Saldo) => this.toSaldoInputFromSaldo(saldo, conta)),
    };
  }
  private toContaPropsFromContaOutput(contaOutputDTO: ContaOutputDTO): ContaProps {
    return {
      id: contaOutputDTO.id,
      descricao: contaOutputDTO.descricao,
      banco: contaOutputDTO.banco,
      cor: contaOutputDTO.cor ?? undefined,
      saldos: contaOutputDTO.saldos.map((saldo: SaldoOutputDTO) =>
        this.toSaldoPropsFromSaldoOutput(saldo),
      ),
    };
  }

  private toSaldoInputFromSaldo(saldo: Saldo, conta: Conta): SaldoInputDTO {
    return {
      id: saldo.id.valor,
      contaId: conta.id.valor,
      data: saldo.data,
      acumulado: saldo.acumulado,
      creditos: saldo.creditos,
      debitos: saldo.debitos,
    };
  }

  private toSaldoPropsFromSaldoOutput(saldo: SaldoOutputDTO): SaldoProps {
    return {
      id: saldo.id,
      data: saldo.data,
      acumulado: saldo.acumulado,
      creditos: saldo.creditos,
      debitos: saldo.debitos,
    };
  }
}
