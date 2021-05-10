import { MeMessage } from "honkbeep-protocol/types/ApiMessages";
import { Router } from "../types/ServerTypes";

export default function meRoute(router: Router) {
  router.get("/me", (ctx, next) => {
    const user = ctx.session?.user;
    (ctx.body as MeMessage) = user ? { user } : {};
  });
}
