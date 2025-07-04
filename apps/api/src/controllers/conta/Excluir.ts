import { NextFunction, Request, Response, Router } from "express";
import { ServerFacade, UsuarioDTO } from "adapters";

export default class ContaExcluirController {
  constructor(private server: Router, private serverFacade: ServerFacade, ...middleware: any[]) {
    this.server.patch(
      "/contas/:id",
      ...middleware,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const usuarioId = req.user as UsuarioDTO;
          const id = req.params.id as string;
          const conta = req.body.conta;

          if (id !== conta.id) {
            res.sendStatus(403).json({ error: "Parâmetro ID inválido" });
            return;
          }
          await this.serverFacade.conta.excluir(usuarioId, conta);
          res.sendStatus(204);
        } catch (error) {
          next(error);
        }
      },
    );
  }
}
