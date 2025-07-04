import { NextFunction, Request, Response, Router } from "express";
import { ServerFacade, UsuarioDTO } from "adapters";

export default class CategoriaConsultarController {
  constructor(private server: Router, private serverFacade: ServerFacade, ...middleware: any[]) {
    this.server.get(
      "/categorias",
      ...middleware,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const usuario = req.user as UsuarioDTO;
          const categorias = await this.serverFacade.categoria.consultar(usuario);
          res.status(200).json(categorias);
        } catch (error) {
          next(error);
        }
      },
    );
  }
}
