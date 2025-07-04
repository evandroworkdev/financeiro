import { NextFunction, Request, Response, Router } from "express";
import { CartaoDTO, ServerFacade, UsuarioDTO } from "adapters";

export default class CartaoSalvarController {
  constructor(private server: Router, private serverFacade: ServerFacade, ...middleware: any[]) {
    this.server.put(
      "/cartoes",
      ...middleware,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const usuario = req.user as UsuarioDTO;
          const cartao = req.body.cartao as CartaoDTO;

          await this.serverFacade.cartao.salvar(usuario, cartao);
          res.sendStatus(204);
        } catch (error) {
          next(error);
        }
      },
    );
  }
}
