import { NextFunction, Request, Response, Router } from "express";
import { ServerFacade, UsuarioDTO } from "adapters";

export default class CategoriaSalvarTodasController {
  constructor(private server: Router, private serverFacade: ServerFacade, ...middleware: any[]) {
    this.server.post(
      "/categorias",
      ...middleware,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const usuario = req.user as UsuarioDTO;
          const categorias = req.body.categorias;
          await this.serverFacade.categoria.salvarTodas(usuario, categorias);
          res.sendStatus(204);
        } catch (error) {
          next(error);
        }
      },
    );
  }
}
