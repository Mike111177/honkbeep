import Koa from "koa";
import BaseRouter from "@koa/router";
import { WebSocketContext } from "../middleware/WebSocket";

export type ServerState = Koa.DefaultState;
export type ServerContext = Koa.DefaultContext & WebSocketContext;
export type ServerMiddleware = Koa.Middleware<ServerState, ServerContext>;
export type Router = BaseRouter<ServerState, ServerContext>;
