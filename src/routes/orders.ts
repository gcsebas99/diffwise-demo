import type { Db } from "../db.ts";
import type { Router } from "../router.ts";
import { badRequest } from "./validation.ts";

export function registerOrderRoutes(router: Router, db: Db): void {
  router.get("/orders", (req) => {
    const orders = [...db.orders.values()].filter((o) => o.userId === req.user?.id);
    return { status: 200, body: { orders } };
  });

  router.post("/orders", (req) => {
    const input = req.body as { totalCents?: unknown } | undefined;
    if (typeof input?.totalCents !== "number" || !Number.isInteger(input.totalCents)) {
      return badRequest("totalCents must be an integer");
    }
    if (input.totalCents <= 0) {
      return badRequest("totalCents must be positive");
    }
    const order = {
      id: db.nextId("ord"),
      userId: req.user?.id ?? "",
      totalCents: input.totalCents,
      status: "pending" as const,
    };
    db.orders.set(order.id, order);
    return { status: 201, body: order };
  });
}
