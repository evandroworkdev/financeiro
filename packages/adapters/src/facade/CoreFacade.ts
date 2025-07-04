import { ProvedorAutenticacao } from "core";
import { ProvedorDados } from "..";
import CartaoFacade from "./cartao/CartaoFacade";
import ColecaoCartao from "../db/colecao/ColecaoCartao";
import ColecaoCategoria from "../db/colecao/ColecaoCategoria";
import ColecaoConta from "../db/colecao/ColecaoConta";
import ColecaoEvento from "../db/colecao/ColecaoEvento";
import ColecaoExtrato from "../db/colecao/ColecaoExtrato";
import ColecaoUsuario from "../db/colecao/ColecaoUsuario";
import UsuarioFacade from "./usuario/UsuarioFacade";
import AutenticacaoFacade from "./autenticacao/AutenticacaoFacade";
import CategoriaFacade from "./categoria/CategoriaFacade";
import ContaFacade from "./conta/ContaFacade";
import ExtratoFacade from "./extrato/ExtratoFacade";

class CoreFacade {
  constructor(
    private readonly _dados: ProvedorDados,
    private readonly _autenticacao?: ProvedorAutenticacao,
  ) {}

  get autenticacao() {
    return new AutenticacaoFacade(this._autenticacao!, new ColecaoUsuario(this._dados));
  }

  get cartao() {
    return new CartaoFacade(new ColecaoCartao(this._dados));
  }

  get categoria() {
    return new CategoriaFacade(new ColecaoCategoria(this._dados));
  }

  get conta() {
    return new ContaFacade(new ColecaoConta(this._dados));
  }

  get extrato() {
    return new ExtratoFacade(new ColecaoExtrato(this._dados), new ColecaoEvento(this._dados));
  }

  get usuario() {
    return new UsuarioFacade(new ColecaoUsuario(this._dados));
  }
}

export { CoreFacade };
