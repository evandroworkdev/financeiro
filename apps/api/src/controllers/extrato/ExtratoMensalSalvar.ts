import { NextFunction, Request, Response, Router } from "express";
import { ExtratoDTO, ServerFacade, TransacaoDTO, UsuarioDTO } from "adapters";

export default class ExtratoMensalSalvarController {
  constructor(private server: Router, private serverFacade: ServerFacade, ...middleware: any[]) {
    this.server.put(
      "/extratos/mensais",
      ...middleware,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const usuario = req.user as UsuarioDTO;
          const extrato = req.body.extrato as ExtratoDTO;
          const transacao = req.body.transacao as TransacaoDTO;
          await this.serverFacade.extrato.salvarTransacao(usuario, extrato, transacao);
          res.sendStatus(204);
        } catch (error) {
          next(error);
        }
      },
    );
  }
}
