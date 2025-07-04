import { NextFunction, Request, Response, Router } from "express";
import { ServerFacade, UsuarioDTO } from "adapters";

export default class UsuarioSalvarController {
  constructor(private server: Router, private serverFacade: ServerFacade, ...middleware: any[]) {
    this.server.put(
      "/usuarios/:id",
      ...middleware,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const id = req.params.id;
          const usuarioRec = req.user as UsuarioDTO;
          const usuario = req.body.usuario as UsuarioDTO;

          if (usuarioRec.id !== id || usuarioRec.id !== usuario.id) {
            res.status(403).json({ error: "Parâmetro Id da rota diferente do Id body" });
            return;
          }
          await this.serverFacade.usuario.salvar(usuario);
          res.sendStatus(204);
        } catch (error) {
          next(error);
        }
      },
    );
  }
}
