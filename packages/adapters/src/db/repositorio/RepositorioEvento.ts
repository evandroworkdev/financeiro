import { Evento, PublicadorEvento, Resultado } from "core";

export default class RepositorioEvento implements PublicadorEvento {
  async publicar(...eventos: Evento[]): Promise<Resultado<void>> {
    return Resultado.ok();
  }
}
