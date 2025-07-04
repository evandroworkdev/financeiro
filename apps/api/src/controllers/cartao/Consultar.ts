import { NextFunction, Request, Response, Router } from "express";
import { ServerFacade, UsuarioDTO } from "adapters";

export default class CartaoConsultarController {
  constructor(private server: Router, private serverFacade: ServerFacade, ...middleware: any[]) {
    this.server.get(
      "/cartoes",
      ...middleware,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const usuario = req.user as UsuarioDTO;
          const cartaos = await this.serverFacade.cartao.consultar(usuario);
          res.status(200).json(cartaos);
        } catch (error) {
          next(error);
        }
      },
    );
  }
}
