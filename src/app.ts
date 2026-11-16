import { requireAuth } from "./auth.ts";
import { Db } from "./db.ts";
import { rateLimit } from "./rate-limit.ts";
import { Router } from "./router.ts";
import { registerHealthRoutes } from "./routes/health.ts";
import { registerOrderRoutes } from "./routes/orders.ts";
import { registerUserRoutes } from "./routes/users.ts";

export function createApp(secret: string, db = new Db()): { router: Router; db: Db } {
  const router = new Router();
  router.use(requireAuth(secret));
  router.use(rateLimit());
  registerHealthRoutes(router);
  registerUserRoutes(router, db);
  registerOrderRoutes(router, db);
  return { router, db };
}
