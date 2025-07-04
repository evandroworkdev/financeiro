import { NextFunction, Request, Response, Router } from "express";
import { ServerFacade, UsuarioDTO } from "adapters";

export default class ContaConsultarController {
  constructor(private server: Router, private serverFacade: ServerFacade, ...middleware: any[]) {
    this.server.get(
      "/contas",
      ...middleware,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const usuario = req.user as UsuarioDTO;
          const contas = await this.serverFacade.conta.consultar(usuario);
          res.status(200).json(contas);
        } catch (error) {
          next(error);
        }
      },
    );
  }
}
