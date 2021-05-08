import Koa from "koa";
import session from "koa-session";
import bodyparser from "koa-bodyparser";
import WebSocketMiddleware from "./middleware/WebSocket";

import Api from "./routes";
import { ServerContext, ServerState } from "./types/ServerTypes";
import { getUser } from "./Server/OnlineUsers";
import "./db";

console.log("Starting Honkbeep Server");

const app = new Koa<ServerState, ServerContext>();
const ws = WebSocketMiddleware();
const api = Api();

app
  .use(session({ key: "honk.sess", signed: false }, app))
  .use(async (ctx, next) => {
    //Clean up bad sessions
    if (ctx.session && !ctx.session.isNew && ctx.session.user) {
      const realUser = getUser(ctx.session.user.id);
      if (!realUser || realUser.name !== ctx.session.user.name) {
        ctx.session.user = undefined;
      }
    }
    await next();
  })
  .use(ws)
  .use(bodyparser())
  .use(api.routes())
  .use(api.allowedMethods());

app.listen(3001);
