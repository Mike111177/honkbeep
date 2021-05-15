import Koa from "koa";
import session from "koa-session";
import bodyparser from "koa-bodyparser";
import WebSocketMiddleware from "./middleware/WebSocket";

import { checkEnvironment } from "./environment";
import Api from "./routes";
import { ServerContext, ServerState } from "./types/ServerTypes";
import { initDB, sessionConfig } from "./db";

//Load config
checkEnvironment();
console.log(process.env.HONKBEEP_PORT);
const port = parseInt(process.env.HONKBEEP_PORT!);

console.log(`Starting Honkbeep Server on port ${port}`);

initDB();

const app = new Koa<ServerState, ServerContext>();
const api = Api();
app
  .use(session(sessionConfig(), app))
  .use(WebSocketMiddleware())
  .use(bodyparser())
  .use(api.routes())
  .use(api.allowedMethods())
  .listen(port);
