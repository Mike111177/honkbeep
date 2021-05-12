import { query } from "../db";
import { Router } from "../types/ServerTypes";

export default function loginRoute(router: Router) {
  router.post("/login", async (ctx, next) => {
    const name = ctx.request.body.name;
    if (name.length < 3) {
      ctx.response.status = 400;
      ctx.response.body = "Please choose longer name.";
    } else {
      const queryResponse = await query(
        `SELECT user_id, username FROM accounts WHERE username=${name}`
      );
      console.log(queryResponse);
      ctx.body = ctx.session!.user;
    }
    await next();
  });
}
