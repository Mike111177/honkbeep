import { Router } from "../types/ServerTypes";
import { createNewTable, getActiveTable, listTables } from "../Table/Table";

export default function tableRoute(router: Router) {
  router.get("/table/list", async (ctx, next) => {
    const tableList = Array.from(listTables()).map(([id, { state }]) => ({
      id,
      state,
    }));
    ctx.body = tableList;
    await next();
  });
  router.get("/table/create", async (ctx, next) => {
    ctx.body = { id: createNewTable(ctx.session!.user.id) };
    await next();
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
