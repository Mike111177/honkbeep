import Router from "@koa/router";
import { MeMessage, StatusMessage } from "../backend/types/ApiMessages";
import { ServerContext, ServerState } from "./types/ServerTypes";
import ServerBoard from "./ServerBoard";
import { genericPlayers, genericVariant } from "../game";
import { GameServerBackend } from "./GameServerBackend";
import WebSocket from "ws";
import {
  LobbyMessage,
  LobbyMessageType,
  LobbyState,
} from "../backend/types/LobbyMessage";
import { MessageSocket } from "../util/MessageSocket";

const variantDef = genericVariant();
const board = new ServerBoard(variantDef, genericPlayers(variantDef));

const users = new Map<number, string>();
class Lobby {
  sockets: MessageSocket<LobbyMessage, WebSocket>[] = [];
  state: LobbyState = { leader: 0, players: [] };
  addUser(ws: WebSocket, id: number) {
    const mws = new MessageSocket<LobbyMessage, WebSocket>(ws);
    mws.onmessage = (msg) => {
      switch (msg.type) {
        case LobbyMessageType.LobbyStartRequest:
          if (id === this.state.leader) {
            this.sockets.forEach((s) => {
              s.send({ type: LobbyMessageType.GameStartNotification });
            });
          }
      }
    };
    if (this.state.players.length === 0) {
      this.state.leader = id;
    }
    if (this.state.players.find((user) => id === user.id) === undefined) {
      this.state.players.push({ id, name: users.get(id)! });
    }
    this.sockets.push(mws);
    this.sockets.forEach((s) => {
      s.send({ type: LobbyMessageType.LobbyUpdate, state: this.state });
    });
  }
}

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
    } else if (Array.from(users.values()).includes(name)) {
      ctx.response.status = 403;
      ctx.response.body = "User already exists.";
    } else {
      ctx.session!.name = name;
      ctx.body = { name };
      users.set(ctx.session!.user, name);
    }
  });
  router.get("/me", (ctx, next) => {
    const id = ctx.session!.user;
    const name = users.get(id);
    (ctx.body as MeMessage) = name !== undefined ? { user: { id, name } } : {};
  });
  router.all("/game", async (ctx, next) => {
    if (ctx.ws) {
      const ws = await ctx.ws();
      new GameServerBackend(ws, board);
    } else {
      ctx.status = 400;
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
