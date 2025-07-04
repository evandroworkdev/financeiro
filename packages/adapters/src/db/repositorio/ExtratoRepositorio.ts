import {
  AnoMesId,
  Extrato,
  ExtratoProps,
  Recorrencia,
  RecorrenciaProps,
  RepositorioExtrato,
  Resultado,
  TipoOperacao,
  Transacao,
  TransacaoProps,
  Usuario,
} from "core";
import {
  ExtratoInputDTO,
  ExtratoOutputDTO,
  ProvedorDadosExtrato,
  RecorrenciaInputDTO,
  RecorrenciaOutputDTO,
  TransacaoBaseInputDTO,
  TransacaoBaseOutputDTO,
  TransacaoInputDTO,
  TransacaoOutputDTO,
} from "../../provider";

export default class ExtratoRepositorio implements RepositorioExtrato {
  constructor(private readonly extratoProvedorDados: ProvedorDadosExtrato) {}

  async salvar(usuario: Usuario, extrato: Extrato): Promise<Resultado<void>> {
    const usuarioId = usuario.id.valor;
    const dados = this.toExtratoInputFromExtrato(extrato, usuario);
    await this.extratoProvedorDados.salvar(usuarioId, dados);
    return Resultado.ok();
  }
  async salvarTodos(usuario: Usuario, extratos: Extrato[]): Promise<Resultado<void>> {
    const usuarioId = usuario.id.valor;
    const dados = extratos.map((extrato: Extrato) =>
      this.toExtratoInputFromExtrato(extrato, usuario),
    );
    await this.extratoProvedorDados.salvarTodos(usuarioId, dados);
    return Resultado.ok();
  }
  async salvarRecorrencia(
    usuario: Usuario,
    extratos: Extrato[],
    recorrencia: Recorrencia,
  ): Promise<Resultado<void>> {
    const usuarioId = usuario.id.valor;

    const extratosInput = extratos.map((extrato: Extrato) =>
      this.toExtratoInputFromExtrato(extrato, usuario),
    );
    const recorrenciaInput = this.toRecorrenciaInputFromRecorrencia(usuarioId, recorrencia);
    await this.extratoProvedorDados.salvarRecorrencia(usuarioId, extratosInput, recorrenciaInput);

    return Resultado.ok();
  }
  async consultar(usuario: Usuario): Promise<Resultado<Extrato[]>> {
    const usuarioId = usuario.id.valor;
    const consultaDb = await this.extratoProvedorDados.consultar(usuarioId);
    const extratosProps = consultaDb.map((extrato: ExtratoOutputDTO) =>
      this.toExtratoPropsFromExtratoOutput(extrato),
    );
    return Extrato.novos(extratosProps);
  }
  async consultarPorId(usuario: Usuario, id: AnoMesId): Promise<Resultado<Extrato | null>> {
    const usuarioId = usuario.id.valor;
    const consultaDb = await this.extratoProvedorDados.consultarPorId(usuarioId, id.valor);
    if (!consultaDb) return Resultado.nulo();
    const extratoProps = this.toExtratoPropsFromExtratoOutput(consultaDb);
    return Extrato.novo(extratoProps);
  }
  async consultarPorIds(usuario: Usuario, ids: AnoMesId[]): Promise<Resultado<Extrato[]>> {
    const usuarioId = usuario.id.valor;
    const idsConsulta = ids.map((id: AnoMesId) => id.valor);
    const consultaDb = await this.extratoProvedorDados.consultarPorIds(usuarioId, idsConsulta);
    const extratosProps = consultaDb.map((e: ExtratoOutputDTO) =>
      this.toExtratoPropsFromExtratoOutput(e),
    );
    return Extrato.novos(extratosProps);
  }
  async consultarRecorrencias(usuario: Usuario): Promise<Resultado<Recorrencia[]>> {
    const usuarioId = usuario.id.valor;
    const consultaDb = await this.extratoProvedorDados.consultarRecorrencias(usuarioId);
    const recorrenciasProps = consultaDb.map((r: RecorrenciaOutputDTO) =>
      this.toRecorrenciaPropsFromRecorrenciaOutput(r),
    );
    return Recorrencia.novas(recorrenciasProps);
  }
  async consultarRecorrenciasPorMes(
    usuario: Usuario,
    data: Date,
  ): Promise<Resultado<Recorrencia[]>> {
    const usuarioId = usuario.id.valor;
    const consultaDb = await this.extratoProvedorDados.consultarRecorrenciasPorMes(usuarioId, data);
    const recorrenciasProps = consultaDb.map((r: RecorrenciaOutputDTO) =>
      this.toRecorrenciaPropsFromRecorrenciaOutput(r),
    );
    return Recorrencia.novas(recorrenciasProps);
  }
  async consultarRecorrenciaPorId(
    usuario: Usuario,
    id: string,
  ): Promise<Resultado<Recorrencia | null>> {
    const usuarioId = usuario.id.valor;
    const consultaDb = await this.extratoProvedorDados.consultarRecorrenciaPorId(usuarioId, id);
    if (!consultaDb) return Resultado.nulo();
    const recorrenciaProps = this.toRecorrenciaPropsFromRecorrenciaOutput(consultaDb);
    return Recorrencia.nova(recorrenciaProps);
  }
  async excluirRecorrencia(
    usuario: Usuario,
    extratos: Extrato[],
    recorrencia: Recorrencia,
  ): Promise<Resultado<void>> {
    const usuarioId = usuario.id.valor;
    const extratosInput = extratos.map((extrato: Extrato) =>
      this.toExtratoInputFromExtrato(extrato, usuario),
    );
    const recorrenciaInput = this.toRecorrenciaInputFromRecorrencia(usuarioId, recorrencia);
    await this.extratoProvedorDados.excluirRecorrencia(usuarioId, extratosInput, recorrenciaInput);
    return Resultado.ok();
  }

  private toExtratoInputFromExtrato(extrato: Extrato, usuario: Usuario): ExtratoInputDTO {
    const transacoesRemovidas = extrato.getTransacoesRemovidas().map((t) => t.id.valor);
    return {
      id: extrato.id.valor,
      usuarioId: usuario.id.valor,
      data: extrato.data,
      sumarioData: extrato.sumario.data,
      sumarioReceitas: extrato.sumario.receitas,
      sumarioDespesas: extrato.sumario.despesas,
      sumarioTotal: extrato.sumario.total,
      transacoesRemovidas: transacoesRemovidas,
      transacoes: extrato.transacoes.map((t: Transacao) =>
        this.toTransacaoInputFromTransacao(usuario.id.valor, t),
      ),
    };
  }
  private toExtratoPropsFromExtratoOutput(extratoOutputDTO: ExtratoOutputDTO): ExtratoProps {
    return {
      id: extratoOutputDTO.id,
      data: extratoOutputDTO.data,
      sumarioData: extratoOutputDTO.sumario_data,
      sumarioReceitas: extratoOutputDTO.sumario_receitas,
      sumarioDespesas: extratoOutputDTO.sumario_despesas,
      sumarioTotal: extratoOutputDTO.sumario_total,
      transacoes: extratoOutputDTO.transacoes.map((t: TransacaoOutputDTO) =>
        this.toTransacaoPropsFromTransacaoOutput(t),
      ),
    };
  }
  private toRecorrenciaInputFromRecorrencia(
    usuarioId: string,
    recorrencia: Recorrencia,
  ): RecorrenciaInputDTO {
    return {
      id: recorrencia.id.valor,
      usuarioId: usuarioId,
      iniciarNaParcela: recorrencia.iniciarNaParcela,
      qtdeDeParcelas: recorrencia.qtdeDeParcelas,
      dataFim: recorrencia.dataFim,
      indefinida: recorrencia.indefinida,
      transacao: this.toTransacaoBaseInputFromTransacao(
        usuarioId,
        recorrencia.transacao,
        recorrencia.id.valor,
      ),
    };
  }
  private toRecorrenciaPropsFromRecorrenciaOutput(
    recorrencia: RecorrenciaOutputDTO,
  ): RecorrenciaProps {
    return {
      id: recorrencia.id,
      dataFim: recorrencia.dataFim,
      indefinida: recorrencia.indefinida,
      iniciarNaParcela: recorrencia.iniciarNaParcela,
      qtdeDeParcelas: recorrencia.qtdeDeParcelas,
      transacao: recorrencia.transacao
        ? this.toTransacaoBasePropsFromTransacaoBaseOutput(recorrencia.transacao)
        : undefined,
    };
  }
  private toTransacaoInputFromTransacao(
    usuarioId: string,
    transacao: Transacao,
  ): TransacaoInputDTO {
    return {
      id: transacao.id.valor,
      usuarioId: usuarioId,
      extratoUsuarioId: usuarioId,
      extratoId: transacao.id.valor,
      recorrenciaId: transacao.recorrenciaId,
      contaId: transacao.contaId,
      cartaoId: transacao.cartaoId,
      categoriaId: transacao.categoriaId,
      numeroParcela: transacao.numeroParcela,
      nome: transacao.nome.valor,
      valor: transacao.valor,
      data: transacao.data,
      consolidada: transacao.consolidada,
      emMemoria: transacao.emMemoria,
      virtual: transacao.virtual,
      operacao: transacao.operacao,
      observacoes: transacao.observacoes,
      valoresDetalhados: [],
      agruparPor: transacao.agruparPor,
    };
  }
  private toTransacaoPropsFromTransacaoOutput(transacao: TransacaoOutputDTO): TransacaoProps {
    return {
      id: transacao.id,
      nome: transacao.nome,
      valor: transacao.valor,
      data: transacao.data,
      consolidada: transacao.consolidada,
      operacao: transacao.operacao as TipoOperacao,
      observacoes: transacao.observacoes ?? undefined,
      contaId: transacao.contaId,
      cartaoId: transacao.cartaoId,
      categoriaId: transacao.categoriaId,
      recorrenciaId: transacao.recorrenciaId,
      numeroParcela: transacao.numeroParcela,
      valoresDetalhados: [],
      emMemoria: transacao.emMemoria,
      virtual: transacao.virtual,
      agruparPor: transacao.agruparPor ?? undefined,
    };
  }
  private toTransacaoBaseInputFromTransacao(
    usuarioId: string,
    transacao: Transacao,
    recorrenciaId: string,
  ): TransacaoBaseInputDTO {
    return {
      id: transacao.id.valor,
      usuarioId: usuarioId,
      recorrenciaId: recorrenciaId,
      contaId: transacao.contaId,
      cartaoId: transacao.cartaoId,
      categoriaId: transacao.categoriaId,
      numeroParcela: transacao.numeroParcela,
      nome: transacao.nome.valor,
      valor: transacao.valor,
      data: transacao.data,
      consolidada: transacao.consolidada,
      emMemoria: transacao.emMemoria,
      virtual: transacao.virtual,
      operacao: transacao.operacao,
      observacoes: transacao.observacoes,
      valoresDetalhados: [],
      agruparPor: transacao.agruparPor,
    };
  }
  private toTransacaoBasePropsFromTransacaoBaseOutput(
    transacao: TransacaoBaseOutputDTO,
  ): TransacaoProps {
    return {
      id: transacao.id,
      nome: transacao.nome,
      valor: transacao.valor,
      data: transacao.data,
      consolidada: transacao.consolidada,
      operacao: transacao.operacao as TipoOperacao,
      observacoes: transacao.observacoes ?? undefined,
      contaId: transacao.contaId,
      cartaoId: transacao.cartaoId,
      categoriaId: transacao.categoriaId,
      recorrenciaId: transacao.recorrenciaId,
      numeroParcela: transacao.numeroParcela,
      valoresDetalhados: [],
      emMemoria: transacao.emMemoria,
      virtual: transacao.virtual,
      agruparPor: transacao.agruparPor ?? undefined,
    };
  }
}
