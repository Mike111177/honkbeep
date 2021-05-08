import { Router } from "../types/ServerTypes";
import { createNewTable, getActiveTable } from "../Server/ActiveTables";

export default function tableRoute(router: Router) {
  router.post("/table/create", (ctx, next) => {
    ctx.body = { id: createNewTable(ctx.session!.user) };
  });
  router.all("/table/join/:id", async (ctx, next) => {
    const table = getActiveTable(ctx.params.id);
    if (table !== undefined) {
      if (ctx.ws) {
        table.addUser(await ctx.ws(), ctx.session!.user);
      } else {
        ctx.status = 400;
      }
    }
    await next();
  });
}
