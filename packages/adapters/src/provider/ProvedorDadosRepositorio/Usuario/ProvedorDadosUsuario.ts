import { UsuarioInputDTO } from "./UsuarioInputDTO";
import { UsuarioOutputDTO } from "./UsuarioOutputDTO";

export default interface ProvedorDadosUsuario {
  salvar(usuario: UsuarioInputDTO): Promise<void>;
  consultarPorEmail(email: string): Promise<UsuarioOutputDTO | null>;
}
