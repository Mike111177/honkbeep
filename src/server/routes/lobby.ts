import { Router } from "../types/ServerTypes";

export default function meRoute(router: Router) {
  router.get("/lobby", (ctx, next) => {});
}
