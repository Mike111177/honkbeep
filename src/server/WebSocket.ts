import WebSocket from "ws";
import { ServerMiddleware } from "./ServerTypes";

export type WebSocketContext = {
  ws?: () => Promise<WebSocket>;
};

export default function createWebsocketMiddleware(): ServerMiddleware {
  const wss = new WebSocket.Server({ noServer: true });

  return async (ctx, next) => {
    const upgradeHeader = (ctx.request.headers.upgrade || "")
      .split(",")
      .map((s) => s.trim());

    if (~upgradeHeader.indexOf("websocket")) {
      ctx.ws = () =>
        new Promise((resolve) => {
          wss.handleUpgrade(
            ctx.req,
            ctx.request.socket,
            Buffer.alloc(0),
            resolve
          );
          ctx.respond = false;
        });
    }

    await next();
  };
}
