import Koa from "koa";
import Router from "@koa/router";

import { StatusMessage } from "../backend/types/ApiMessages";

const app = new Koa();
const apiRouter = new Router({ prefix: "/api" });

console.log("Starting Honkbeep Server");

apiRouter.get("/status", (ctx, next) => {
  const msg: StatusMessage = { status: "UP" };
  ctx.body = JSON.stringify(msg);
  ctx.response.type = "application/json";
});

app.use(apiRouter.routes()).use(apiRouter.allowedMethods());

app.listen(3001);
