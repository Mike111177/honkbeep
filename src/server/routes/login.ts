import { getUser } from "../Server/OnlineUsers";
import { Router } from "../types/ServerTypes";

export default function loginRoute(router: Router) {
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
}
