import { NextFunction, Request, Response, Router } from "express";
import { ExtratoDTO, ServerFacade, TransacaoDTO, UsuarioDTO } from "adapters";

export default class ExtratoRecorrenciaExcluirController {
  constructor(private server: Router, private serverFacade: ServerFacade, ...middleware: any[]) {
    this.server.delete(
      "/extratos/recorrencias/:id",
      ...middleware,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const usuario = req.user as UsuarioDTO;
          const id = req.params.id as string;
          await this.serverFacade.extrato.excluirRecorrencia(usuario, id);
          res.sendStatus(204);
        } catch (error) {
          next(error);
        }
      },
    );
  }
}
