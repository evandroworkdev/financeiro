import { NextFunction, Request, Response, Router } from "express";
import { ServerFacade, UsuarioDTO } from "adapters";

export default class ExtratoMensalConsultarController {
  constructor(private server: Router, private serverFacade: ServerFacade, ...middleware: any[]) {
    this.server.post(
      "/extratos/mensais",
      ...middleware,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const usuario = req.user as UsuarioDTO;
          const datas = req.body.datas;
          const extratosDTO = await this.serverFacade.extrato.consultarTodos(usuario, datas);
          res.status(200).json(extratosDTO);
        } catch (error) {
          next(error);
        }
      },
    );
  }
}
