import Koa from "koa";
import { WebSocketContext } from "./WebSocket";

export type ServerState = Koa.DefaultState;
export type ServerContext = Koa.DefaultContext & WebSocketContext;
export type ServerMiddleware = Koa.Middleware<ServerState, ServerContext>;
