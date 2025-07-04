import { NextFunction, Request, Response, Router } from "express";
import { ServerFacade, UsuarioDTO } from "adapters";

export default class CategoriaSalvarController {
  constructor(private server: Router, private serverFacade: ServerFacade, ...middleware: any[]) {
    this.server.put(
      "/categorias",
      ...middleware,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const usuario = req.user as UsuarioDTO;
          const categoria = req.body.categoria;

          await this.serverFacade.categoria.salvar(usuario, categoria);
          res.sendStatus(204);
        } catch (error) {
          next(error);
        }
      },
    );
  }
}
