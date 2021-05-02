import Router from "@koa/router";
import { StatusMessage } from "../backend/types/ApiMessages";
import { ServerContext, ServerState } from "./types/ServerTypes";

export default function Api() {
  const router = new Router<ServerState, ServerContext>({ prefix: "/api" });
  router.get("/status", (ctx, next) => {
    const msg: StatusMessage = { status: "UP" };
    ctx.body = JSON.stringify(msg);
    ctx.response.type = "application/json";
  });
  return router;
}
