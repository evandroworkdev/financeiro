import { NextFunction, Request, Response, Router } from "express";
import { ServerFacade, UsuarioDTO } from "adapters";

export default class ExtratoRecorrenciaConsultarController {
  constructor(private server: Router, private serverFacade: ServerFacade, ...middleware: any[]) {
    this.server.get(
      "/extratos/recorrencias",
      ...middleware,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const usuario = req.user as UsuarioDTO;
          const recorrenciasDTO = await this.serverFacade.extrato.consultarRecorrencias(usuario);
          res.status(200).json(recorrenciasDTO);
        } catch (error) {
          next(error);
        }
      },
    );
  }
}
