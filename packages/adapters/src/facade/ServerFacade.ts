import { PublicadorEvento } from "core";
import CartaoRepositorio from "../db/repositorio/CartaoRepositorio";
import CategoriaRepositorio from "../db/repositorio/CategoriaRepositorio";
import ContaRepositorio from "../db/repositorio/ContaRepositorio";
import ExtratoRepositorio from "../db/repositorio/ExtratoRepositorio";
import RepositorioEvento from "../db/repositorio/RepositorioEvento";
import UsuarioRepositorio from "../db/repositorio/UsuarioRepositorio";
import {
  ProvedorDadosCartao,
  ProvedorDadosCategoria,
  ProvedorDadosConta,
  ProvedorDadosExtrato,
  ProvedorDadosUsuario,
} from "../provider";
import CartaoFacade from "./cartao/CartaoFacade";
import CategoriaFacade from "./categoria/CategoriaFacade";
import ContaFacade from "./conta/ContaFacade";
import ExtratoFacade from "./extrato/ExtratoFacade";
import UsuarioFacade from "./usuario/UsuarioFacade";

class ServerFacade {
  constructor(
    private readonly _categoriaProvedorDados: ProvedorDadosCategoria,
    private readonly _cartaoProvedorDados: ProvedorDadosCartao,
    private readonly _contaProvedorDados: ProvedorDadosConta,
    private readonly _extratoProvedorDados: ProvedorDadosExtrato,
    private readonly _usuarioProvedorDados: ProvedorDadosUsuario,
    private readonly _publicadorEvento: PublicadorEvento,
  ) {}

  get categoria() {
    return new CategoriaFacade(new CategoriaRepositorio(this._categoriaProvedorDados));
  }
  get cartao() {
    return new CartaoFacade(new CartaoRepositorio(this._cartaoProvedorDados));
  }
  get conta() {
    return new ContaFacade(new ContaRepositorio(this._contaProvedorDados));
  }
  get usuario() {
    return new UsuarioFacade(new UsuarioRepositorio(this._usuarioProvedorDados));
  }
  get extrato() {
    return new ExtratoFacade(
      new ExtratoRepositorio(this._extratoProvedorDados),
      this._publicadorEvento,
    );
  }
}

export { ServerFacade };
