import { NextFunction, Request, Response, Router } from "express";
import { ServerFacade, UsuarioDTO } from "adapters";

export default class ContaSalvarController {
  constructor(private server: Router, private serverFacade: ServerFacade, ...middleware: any[]) {
    this.server.put(
      "/contas",
      ...middleware,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const usuario = req.user as UsuarioDTO;
          const conta = req.body.conta;

          await this.serverFacade.conta.salvar(usuario, conta);
          res.sendStatus(204);
        } catch (error) {
          next(error);
        }
      },
    );
  }
}
