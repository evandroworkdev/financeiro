import { NextFunction, Request, Response, Router } from "express";
import { ServerFacade, UsuarioDTO } from "adapters";

export default class CategoriaExcluirController {
  constructor(private server: Router, private serverFacade: ServerFacade, ...middleware: any[]) {
    this.server.patch(
      "/categorias/:id",
      ...middleware,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const usuarioId = req.user as UsuarioDTO;
          const id = req.params.id as string;
          const categoria = req.body.categoria;

          if (id !== categoria.id) {
            res.status(403).json({ error: "Parâmetro ID inválido" });
            return;
          }
          await this.serverFacade.categoria.excluir(usuarioId, categoria);
          res.sendStatus(204);
        } catch (error) {
          next(error);
        }
      },
    );
  }
}
