import { DataReferencia, Id } from "../../shared";
import { fn } from "utils";
import AgruparTransacoes from "./AgruparTransacoes";
import AnoMesId from "../../shared/types/AnoMesId";
import Entidade, { EntidadeProps } from "../../shared/base/Entidade";
import GerarSumario from "./GerarSumario";
import GrupoTransacao from "./GrupoTransacao";
import Resultado from "../../shared/base/Resultado";
import Sumario, { SumarioProps } from "./Sumario";
import Transacao, { TransacaoProps } from "./Transacao";

export interface ExtratoProps extends EntidadeProps {
  data: Date;
  sumario?: SumarioProps;
  transacoes: TransacaoProps[];
  grupos?: GrupoTransacao[];
}

export default class Extrato extends Entidade<Extrato, ExtratoProps> {
  private _transacoes: Transacao[];
  private _sumario: Sumario;
  private _grupos: GrupoTransacao[];
  private _transacoesRemovidas: Transacao[] = [];
  private _propsInicias: ExtratoProps;

  constructor(
    readonly id: Id,
    readonly data: Date,
    sumario: Sumario,
    transacoes: Transacao[],
    grupos: GrupoTransacao[],
    props: ExtratoProps,
  ) {
    super(id);
    this._transacoes = transacoes;
    this._sumario = sumario;
    this._grupos = grupos;
    this._propsInicias = props;
  }

  static novos(props: ExtratoProps[]): Resultado<Extrato[]> {
    return Resultado.combinar(props.map(Extrato.novo));
  }

  static novo(props: ExtratoProps): Resultado<Extrato> {
    const gerarAnoMes = AnoMesId.novo(props.data!);
    if (gerarAnoMes.deuErrado) return gerarAnoMes.comoFalha;

    const gerarId = Id.novo(gerarAnoMes.instancia.valor);

    const gerarTransacoes = Transacao.novas(props.transacoes ?? []);
    const dataReferencia = DataReferencia.nova(props.data);

    const criarAtributos = Resultado.combinar<any>([gerarId, gerarTransacoes, dataReferencia]);
    if (criarAtributos.deuErrado) return criarAtributos.comoFalha;

    const transacoes = gerarTransacoes.instancia;

    const sumario = Extrato.gerarSumario(props);
    const grupos = AgruparTransacoes.com(transacoes);

    const propsCompleto: Required<ExtratoProps> = {
      id: gerarId.instancia.valor,
      data: props.data,
      sumario: sumario.props,
      transacoes: transacoes.map((t) => t.props),
      grupos: grupos,
    };

    return Resultado.ok(
      new Extrato(
        gerarId.instancia,
        propsCompleto.data,
        sumario,
        transacoes,
        grupos,
        fn.obj.manterAtribs(propsCompleto, [
          "id",
          "data",
          "sumario",
          "faturas",
          "transacoes",
          "grupos",
        ]),
      ),
    );
  }

  get transacoes(): Transacao[] {
    return this._transacoes;
  }
  get sumario(): Sumario {
    return this._sumario;
  }
  get grupos(): GrupoTransacao[] {
    return this._grupos;
  }
  get props(): ExtratoProps {
    return {
      id: this.id.valor,
      data: this.data,
      sumario: this._sumario.props,
      transacoes: this._transacoes.map((t) => t.props),
      grupos: this._grupos,
    };
  }
  get propsIniciais(): ExtratoProps {
    return this._propsInicias;
  }

  getTransacoesRemovidas(): Transacao[] {
    return this._transacoesRemovidas;
  }

  removerTransacao(transacaoId: Id): void {
    const transacaoRemovida = this._transacoes.find((t) => t.id.igual(transacaoId));
    if (!transacaoRemovida) return;

    this._transacoes = this._transacoes.filter((t) => t.id.diferente(transacaoId));
    this._transacoesRemovidas.push(transacaoRemovida);

    this._sumario = Extrato.gerarSumario({
      data: this.data,
      transacoes: this._transacoes.map((t) => t.props),
    });
    this._grupos = AgruparTransacoes.com(this._transacoes);
  }

  adicionarTransacao(novaTransacao: Transacao): void {
    const existe = this._transacoes.some((t) => t.id.igual(novaTransacao.id));
    if (existe) return;

    this._transacoes.push(novaTransacao);

    this._sumario = Extrato.gerarSumario({
      data: this.data,
      transacoes: this._transacoes.map((t) => t.props),
    });

    this._grupos = AgruparTransacoes.com(this._transacoes);
  }

  private static gerarSumario(extrato: ExtratoProps): Sumario {
    if (extrato.transacoes?.length) return GerarSumario.com(extrato.data, extrato.transacoes);
    if (extrato.sumario) return Sumario.novo(extrato.sumario).instancia;
    return Sumario.vazio(extrato.data).instancia;
  }
}
