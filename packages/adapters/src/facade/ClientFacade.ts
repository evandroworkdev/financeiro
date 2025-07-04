import { ProvedorAutenticacao } from "core";
import { ProvedorDadosUsuario } from "..";
import AutenticacaoFacade from "./autenticacao/AutenticacaoFacade";
import UsuarioRepositorio from "../db/repositorio/UsuarioRepositorio";
import ClientExtratoFacade from "./extrato/ClientExtratoFacade";
import ClientCategoriaFacade from "./categoria/ClientCategoriaFacade";

class ClientFacade {
  constructor(
    private readonly _autenticacao: ProvedorAutenticacao,
    private readonly _usuarioProvedorDados: ProvedorDadosUsuario,
  ) {}

  get autenticacao() {
    return new AutenticacaoFacade(
      this._autenticacao,
      new UsuarioRepositorio(this._usuarioProvedorDados),
    );
  }
  get extrato() {
    return new ClientExtratoFacade();
  }
  get categoria() {
    return new ClientCategoriaFacade();
  }
}
export { ClientFacade };
