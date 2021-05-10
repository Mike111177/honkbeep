import { StatusMessage } from "honkbeep-protocol/types/ApiMessages";
import { Router } from "../types/ServerTypes";

export default function statusRoute(router: Router) {
  router.get("/status", (ctx, next) => {
    ctx.body = { status: "UP" } as StatusMessage;
    ctx.response.type = "application/json";
  });
}
