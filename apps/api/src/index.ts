import "./setup";
import express, { NextFunction, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import CanalEventosRabbitMQ from "./adapters/evento/CanalEventosRabbitMQ";
import ConsumidorEventoRabbitMq from "./adapters/evento/ConsumidorEventoRabbitMq";
import { PrismaClient } from "@prisma/client";
import { checkAuth } from "./middlewares/checkAuth";
import PublicadorEventoRabbitMQ from "./adapters/evento/PublicadorEventoRabbitMQ";
import { AtualizarFaturas, AtualizarSaldos, ConsultarPorEmail } from "core";
import CategoriaProvedorDadosPrismaAdapter from "./adapters/database/CategoriaProvedorDadosPrismaAdapter";
import CategoriaConsultarController from "./controllers/categoria/Consultar";
import CategoriaExcluirController from "./controllers/categoria/Excluir";
import CategoriaSalvarController from "./controllers/categoria/Salvar";
import CategoriaSalvarTodasController from "./controllers/categoria/SalvarTodas";
import ContaProvedorDadosPrismaAdapter from "./adapters/database/ContaProvedorDadosPrismaAdapter";
import ExtratoProvedorDadosPrismaAdapter from "./adapters/database/ExtratoProvedorDadosPrismaAdapter";
import CartaoProvedorDadosPrismaAdapter from "./adapters/database/CartaoProvedorDadosPrismaAdapter";
import UsuarioProvedorDadosPrismaAdapter from "./adapters/database/UsuarioProvedorDadosPrismaAdapter";
import CartaoConsultarController from "./controllers/cartao/Consultar";
import CartaoSalvarController from "./controllers/cartao/Salvar";
import CartaoExcluirController from "./controllers/cartao/Excluir";
import ContaConsultarController from "./controllers/conta/Consultar";
import ContaExcluirController from "./controllers/conta/Excluir";
import ContaSalvarController from "./controllers/conta/Salvar";
import UsuarioSalvarController from "./controllers/usuario/Salvar";
import UsuarioConsultarController from "./controllers/usuario/Consultar";
import ExtratoMensalConsultarController from "./controllers/extrato/ExtratoMensalConsultar";
import ExtratoMensalExcluirTransacaoController from "./controllers/extrato/ExtratoMensalExcluirTransacao";
import ExtratoMensalSalvarController from "./controllers/extrato/ExtratoMensalSalvar";
import ExtratoRecorrenciaConsultarController from "./controllers/extrato/ExtratoRecorrenciaConsultar";
import ExtratoRecorrenciaConsultarPorIdController from "./controllers/extrato/ExtratoRecorrenciaConsultarPorId";
import ExtratoRecorrenciaExcluirController from "./controllers/extrato/ExtratoRecorrenciaExcluir";
import ExtratoRecorrenciaSalvarController from "./controllers/extrato/ExtratoRecorrenciaSalvar";
import sanitizeInputMiddlware from "./middlewares/sanitizeInputMiddlware";
import { CartaoRepositorio, ContaRepositorio, ServerFacade, UsuarioRepositorio } from "adapters";
import { ResultadoError } from "utils";

const corsOrigin = process.env.CORS_ORIGIN;

// Configuração Ambiente ----------------------------------------------
console.log(`🟢 ENVIRONMENT: ${process.env.NODE_ENV} 🟢`);

// Inicia Servidor Express ------------------------------------------
const app = express();

// Configuração Básica ----------------------------------------------
const corsOptions: CorsOptions = {
  origin: corsOrigin,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(process.env.PORT || 4000, () => {
  console.log(`🔥 Server is running on port ${process.env.PORT}`);
});

// ROTA PRINCIPAL - V1 ------------------------------------
const v1Router = express.Router();
v1Router.use(sanitizeInputMiddlware);
app.use("/v1", v1Router);

// ROTAS AUTH ---------------------------------------------'
const authRouter = express.Router();
v1Router.use("/auth", authRouter);

// Error Handler ------------------------------------------
type ErrorResponse = {
  error: string;
  message: string;
  errors: {}[];
};

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    next(error);
    return;
  }
  const response: ErrorResponse = {
    error: "ERRO_DESCONHECIDO",
    message: "Erro desconhecido",
    errors: [],
  };

  if (error instanceof ResultadoError) {
    response.error = "ERRO_CORE";
    response.message = error.message;
    response.errors = error.erros;
    res.status(400).json(response);
    return;
  }

  if (error instanceof Error) {
    if (error.message.startsWith("Dados Inválidos: ")) {
      response.error = "DADOS_INVALIDOS";
      response.message = "Os dados enviandos são inválidos";
      response.errors.push({ message: error.message });
      res.status(400).json(response);
      return;
    }
    if (error.message.startsWith("Não Autorizado: ")) {
      response.error = "NAO_AUTORIZADO";
      response.message = "Não autorizado";
      response.errors.push({ message: error.message });
      res.status(403).json(response);
      return;
    }
    if (error.message.endsWith("usuário não encontrado")) {
      response.error = "USUARIO_NAO_ENCONTRADO";
      response.message = "Usuário não encontrado";
      response.errors.push({ message: error.message });
      res.sendStatus(204);
      return;
    }
    if (error.message.endsWith("não encontrado")) {
      response.error = "NAO_ENCONTRADO";
      response.message = "Recurso não encontrado";
      response.errors.push({ message: error.message });
      res.status(404).json(response);
      return;
    }
    response.error = "ERROR_DESCONHECIDO";
    response.message = "Error desconhecido";
    response.errors.push({ message: error.message });
    res.status(500).json({ response });
    return;
  } else {
    res.status(500).json(response);
    return;
  }
});

// ADAPTADORES --------------------------------------------
const conexaoPrisma = new PrismaClient();

const canalEventosRabbitMQ = new CanalEventosRabbitMQ();
const publicadorEvento = new PublicadorEventoRabbitMQ(canalEventosRabbitMQ);

const categoriaProvedorDados = new CategoriaProvedorDadosPrismaAdapter(conexaoPrisma);
const contaProvedorDados = new ContaProvedorDadosPrismaAdapter(conexaoPrisma);
const cartaoProvedorDados = new CartaoProvedorDadosPrismaAdapter(conexaoPrisma);
const usuarioProvedorDados = new UsuarioProvedorDadosPrismaAdapter(conexaoPrisma);
const extratoProvedorDados = new ExtratoProvedorDadosPrismaAdapter(conexaoPrisma);

const repositorioContaPrisma = new ContaRepositorio(contaProvedorDados);
const repositorioCartaoPrisma = new CartaoRepositorio(cartaoProvedorDados);
const repositorioUsuarioPrisma = new UsuarioRepositorio(usuarioProvedorDados);

// MIDDLEWARE --------------------------------------------

// FACADE ------------------------------------------------
const serverFacade = new ServerFacade(
  categoriaProvedorDados,
  cartaoProvedorDados,
  contaProvedorDados,
  extratoProvedorDados,
  usuarioProvedorDados,
  publicadorEvento,
);

// CASOS DE USO ------------------------------------------
const consultarPorEmail = new ConsultarPorEmail(repositorioUsuarioPrisma);
const atualizarFaturas = new AtualizarFaturas(repositorioCartaoPrisma);
const atualizarSaldos = new AtualizarSaldos(repositorioContaPrisma);

//  CONSUMERS
const consumidorEventoRabbitMq = new ConsumidorEventoRabbitMq(
  canalEventosRabbitMQ,
  atualizarFaturas,
  atualizarSaldos,
  repositorioUsuarioPrisma,
);
consumidorEventoRabbitMq.iniciar();

//  CONTROLLERS ----------------------------------------------------------------

//--------------------------------------------------------
new CategoriaConsultarController(v1Router, serverFacade, checkAuth(consultarPorEmail));
new CategoriaExcluirController(v1Router, serverFacade, checkAuth(consultarPorEmail));
new CategoriaSalvarController(v1Router, serverFacade, checkAuth(consultarPorEmail));
new CategoriaSalvarTodasController(v1Router, serverFacade, checkAuth(consultarPorEmail));

//--------------------------------------------------------
new CartaoConsultarController(v1Router, serverFacade, checkAuth(consultarPorEmail));
new CartaoSalvarController(v1Router, serverFacade, checkAuth(consultarPorEmail));
new CartaoExcluirController(v1Router, serverFacade, checkAuth(consultarPorEmail));

//--------------------------------------------------------

new ContaConsultarController(v1Router, serverFacade, checkAuth(consultarPorEmail));
new ContaExcluirController(v1Router, serverFacade, checkAuth(consultarPorEmail));
new ContaSalvarController(v1Router, serverFacade, checkAuth(consultarPorEmail));

//------------------------------------------------------------------
new UsuarioSalvarController(v1Router, serverFacade, checkAuth(consultarPorEmail));
new UsuarioConsultarController(v1Router, serverFacade, checkAuth(consultarPorEmail));

//--------------------------------------------------------
new ExtratoMensalConsultarController(v1Router, serverFacade, checkAuth(consultarPorEmail));
new ExtratoMensalExcluirTransacaoController(v1Router, serverFacade, checkAuth(consultarPorEmail));
new ExtratoMensalSalvarController(v1Router, serverFacade, checkAuth(consultarPorEmail));

//--------------------------------------------------------

new ExtratoRecorrenciaConsultarController(v1Router, serverFacade, checkAuth(consultarPorEmail));
new ExtratoRecorrenciaConsultarPorIdController(
  v1Router,
  serverFacade,
  checkAuth(consultarPorEmail),
);
new ExtratoRecorrenciaExcluirController(v1Router, serverFacade, checkAuth(consultarPorEmail));
new ExtratoRecorrenciaSalvarController(v1Router, serverFacade, checkAuth(consultarPorEmail));
