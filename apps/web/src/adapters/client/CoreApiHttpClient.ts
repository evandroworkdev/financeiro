import useApi from "@/data/hooks/useApi";
import CartaoApiHttpClient from "./CartaoApiHttpClient";
import CategoriaApiHttpClient from "./CategoriaApiHttpClient";
import ContaApiHttpClient from "./ContaApiHttpClient";
import ExtratoApiHttpClient from "./ExtratoApiHttpClient";
import UsuarioApiHttpClient from "./UsuarioApiHttpClient";

export default class CoreApiHttpClient {
  constructor(private readonly _api: ReturnType<typeof useApi>) {}

  get cartao() {
    return new CartaoApiHttpClient(this._api);
  }

  get categoria() {
    return new CategoriaApiHttpClient(this._api);
  }

  get conta() {
    return new ContaApiHttpClient(this._api);
  }

  get extrato() {
    return new ExtratoApiHttpClient(this._api);
  }

  get usuario() {
    return new UsuarioApiHttpClient(this._api);
  }
}
