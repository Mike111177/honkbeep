import Koa from "koa";
import Api from "./Api";
import { ServerContext, ServerState } from "./ServerTypes";
import WebSocket from "./WebSocket";

console.log("Starting Honkbeep Server");

const app = new Koa<ServerState, ServerContext>();
const ws = WebSocket();
const api = Api();

app
  .use(ws)
  .use(async (ctx, next) => {
    if (ctx.ws) console.log("REEEE");
    await next();
  })
  .use(api.routes())
  .use(api.allowedMethods());

app.listen(3001);
