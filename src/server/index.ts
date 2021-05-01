import Koa from "koa";
import { GameMessageType } from "../backend/types/GameMessages";
import Api from "./Api";
import { ServerContext, ServerState } from "./ServerTypes";
import WebSocketMiddleware from "./WebSocket";
import WebSocket from "ws";
import ServerBoard from "./ServerBoard";
import { genericDefinition } from "../game";

console.log("Starting Honkbeep Server");

const app = new Koa<ServerState, ServerContext>();
const ws = WebSocketMiddleware();
const api = Api();

const board = new ServerBoard(genericDefinition());

async function handleWebsocket(ws: WebSocket) {
  ws.onmessage = async () => {
    ws.onmessage = () => {};
    ws.send(
      JSON.stringify({
        type: GameMessageType.GameDataResponse,
        data: await board.requestInitialState(0),
      })
    );
  };
  ws.send(JSON.stringify({ type: GameMessageType.GameServerReady }));
}

app
  .use(ws)
  .use(async (ctx, next) => {
    if (ctx.ws && ctx.path.startsWith("/socket")) {
      const ws = await ctx.ws();
      handleWebsocket(ws);
    }
    await next();
  })
  .use(api.routes())
  .use(api.allowedMethods());

app.listen(3001);
