import Koa from "koa";
import Api from "./Api";
import { ServerContext, ServerState } from "./types/ServerTypes";
import WebSocketMiddleware from "./WebSocket";
import ServerBoard from "./ServerBoard";
import { genericPlayers, genericVariant } from "../game";
import { GameServerBackend } from "./GameServerBackend";

console.log("Starting Honkbeep Server");

const app = new Koa<ServerState, ServerContext>();
const ws = WebSocketMiddleware();
const api = Api();

const variantDef = genericVariant();
const board = new ServerBoard(variantDef, genericPlayers(variantDef));

app
  .use(ws)
  .use(async (ctx, next) => {
    if (ctx.ws && ctx.path.startsWith("/socket")) {
      const ws = await ctx.ws();
      new GameServerBackend(ws, board);
    }
    await next();
  })
  .use(api.routes())
  .use(api.allowedMethods());

app.listen(3001);
