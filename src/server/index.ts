import Koa from "koa";
import session from "koa-session";
import bodyparser from "koa-bodyparser";
import WebSocketMiddleware from "./WebSocket";

import Api from "./Api";
import { ServerContext, ServerState } from "./types/ServerTypes";

console.log("Starting Honkbeep Server");

const app = new Koa<ServerState, ServerContext>();
const ws = WebSocketMiddleware();
const api = Api();

let user = 0;

app
  .use(session({ key: "honk.sess", signed: false }, app))
  .use(ws)
  .use(async (ctx, next) => {
    if (ctx.session!.isNew) {
      ctx.session!.user = user;
      user++;
    }
    await next();
  })
  .use(bodyparser())
  .use(api.routes())
  .use(api.allowedMethods());

app.listen(3001);
