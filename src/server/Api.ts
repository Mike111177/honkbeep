import Router from "@koa/router";
import { MeMessage, StatusMessage } from "../backend/types/ApiMessages";
import { ServerContext, ServerState } from "./types/ServerTypes";
import { Lobby } from "./Lobby";
import { getActiveGame } from "./ActiveGames";
import { getUser } from "./OnlineUsers";

const lobby = new Lobby();

export default function Api() {
  const router = new Router<ServerState, ServerContext>({ prefix: "/api" });
  router.get("/status", (ctx, next) => {
    const msg: StatusMessage = { status: "UP" };
    ctx.body = JSON.stringify(msg);
    ctx.response.type = "application/json";
  });
  router.post("/login", (ctx, next) => {
    const name = ctx.request.body.name;
    if (name.length < 3) {
      ctx.response.status = 400;
      ctx.response.body = "Please choose longer name.";
    } else {
      ctx.session!.user = getUser(name);
      ctx.body = ctx.session!.user;
    }
  });
  router.get("/me", (ctx, next) => {
    const user = ctx.session?.user;
    (ctx.body as MeMessage) = user ? { user } : {};
  });
  router.all("/game/:id", async (ctx, next) => {
    const board = getActiveGame(ctx.params.id);
    if (board !== undefined) {
      if (ctx.ws) {
        board.addUserConnection(await ctx.ws(), ctx.session?.user);
      } else {
        ctx.status = 400;
      }
    } else {
      ctx.status = 404;
    }
    await next();
  });
  router.all("/lobby", async (ctx, next) => {
    if (ctx.ws) {
      lobby.addUser(await ctx.ws(), ctx.session!.user);
    } else {
      ctx.status = 400;
    }
    await next();
  });
  return router;
}
