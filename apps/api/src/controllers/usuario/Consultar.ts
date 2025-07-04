import { NextFunction, Request, Response, Router } from "express";
import { ServerFacade } from "adapters";

export default class UsuarioConsultarController {
  constructor(private server: Router, private serverFacade: ServerFacade, ...middleware: any[]) {
    this.server.get(
      "/usuarios/email/:email",
      ...middleware,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const email = req.params.email as string;
          const usuario = await this.serverFacade.usuario.consultar(email);

          if (!usuario) {
            res.status(404).json({
              erro: {
                codigo: 404,
                mensagem: "Usuário não econtrado",
              },
            });
            return;
          }

          res.status(200).json(usuario);
        } catch (error) {
          next(error);
        }
      },
    );
  }
}
