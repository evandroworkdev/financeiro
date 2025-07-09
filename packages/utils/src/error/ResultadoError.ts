import Erro from "./Erro";

export default class ResultadoError extends Error {
  public erros: Erro[];

  constructor(erros: Erro[] | undefined) {
    super("Core com erro");

    this.erros = erros ?? [{ tipo: "ERRO_DESCONHECIDO_RESULTADO_ERROR" }];

    Object.setPrototypeOf(this, ResultadoError.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
