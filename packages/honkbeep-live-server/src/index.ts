import Koa from "koa";
import session from "koa-session";
import bodyparser from "koa-bodyparser";
import WebSocketMiddleware from "./middleware/WebSocket";

import Api from "./routes";
import { ServerContext, ServerState } from "./types/ServerTypes";
import { initDB } from "./db";

console.log("Starting Honkbeep Server");

const app = new Koa<ServerState, ServerContext>();
const ws = WebSocketMiddleware();
const api = Api();

initDB();

const SESSCONFIG: Partial<session.opts> = {
  key: "session",
  signed: false,
  store: {
    async get(key) {
      console.log(key);
    },
    async set(key, sess) {},
    async destroy() {},
  },
};

app
  .use(session(SESSCONFIG, app))
  .use(ws)
  .use(bodyparser())
  .use(api.routes())
  .use(api.allowedMethods());

app.listen(3001);
