import Router from "@koa/router";
import { Router as ServerRouter } from "../types/ServerTypes";
import game from "./game";
import login from "./login";
import me from "./me";
import status from "./status";
import table from "./table";

export default function api() {
  const router = new Router({ prefix: "/api" }) as ServerRouter;
  status(router);
  game(router);
  login(router);
  table(router);
  me(router);
  return router;
}
