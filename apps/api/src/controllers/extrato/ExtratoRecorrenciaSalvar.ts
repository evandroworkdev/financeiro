import { NextFunction, Request, Response, Router } from "express";
import { RecorrenciaDTO, ServerFacade, UsuarioDTO } from "adapters";

export default class ExtratoRecorrenciaSalvarController {
  constructor(private server: Router, private serverFacade: ServerFacade, ...middleware: any[]) {
    this.server.put(
      "/extratos/recorrencias",
      ...middleware,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const usuario = req.user as UsuarioDTO;
          const recorrencia = req.body.recorrencia as RecorrenciaDTO;
          await this.serverFacade.extrato.salvarRecorrencia(usuario, recorrencia);
          res.sendStatus(204);
        } catch (error) {
          next(error);
        }
      },
    );
  }
}
