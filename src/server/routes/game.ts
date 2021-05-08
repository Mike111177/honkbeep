import { getActiveGame } from "../Server/ActiveGames";
import { Router } from "../types/ServerTypes";

export default function gameRoute(router: Router) {
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
}
