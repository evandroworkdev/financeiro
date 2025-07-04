import { NextFunction, Request, Response, Router } from "express";
import { ServerFacade, UsuarioDTO } from "adapters";

export default class ExtratoRecorrenciaConsultarPorIdController {
  constructor(private server: Router, private serverFacade: ServerFacade, ...middleware: any[]) {
    this.server.get(
      "/extratos/recorrencias/:id",
      ...middleware,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const usuario = req.user as UsuarioDTO;
          const id = req.params.id as string;
          const recorrenciaDTO = await this.serverFacade.extrato.consultarRecorrencia(usuario, id);
          res.status(200).json(recorrenciaDTO);
        } catch (error) {
          next(error);
        }
      },
    );
  }
}
