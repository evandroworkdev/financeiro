import { NextFunction, Request, Response, Router } from "express";
import { ServerFacade, UsuarioDTO } from "adapters";

export default class CartaoExcluirController {
  constructor(private server: Router, private serverFacade: ServerFacade, ...middleware: any[]) {
    this.server.patch(
      "/cartoes/:id",
      ...middleware,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const usuario = req.user as UsuarioDTO;
          const id = req.params.id as string;
          const cartao = req.body.cartao;

          if (id !== cartao.id) {
            res.status(403).json({ error: "Parâmetro ID inválido" });
            return;
          }
          await this.serverFacade.cartao.excluir(usuario, cartao);
          res.sendStatus(204);
        } catch (error) {
          next(error);
        }
      },
    );
  }
}
