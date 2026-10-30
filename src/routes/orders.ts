import type { Db, OrderStatus } from "../db.ts";
import type { Router } from "../router.ts";

const ORDER_STATUSES: OrderStatus[] = ["pending", "paid", "shipped"];

export function registerOrderRoutes(router: Router, db: Db): void {
  router.get("/orders", (req) => {
    const status = req.query.get("status");
    if (status !== null && !ORDER_STATUSES.includes(status as OrderStatus)) {
      return { status: 400, body: { error: `status must be one of ${ORDER_STATUSES.join(", ")}` } };
    }
    const orders = [...db.orders.values()].filter(
      (o) => o.userId === req.user?.id && (status === null || o.status === status),
    );
    return { status: 200, body: { orders } };
  });

  router.post("/orders", (req) => {
    const input = req.body as { totalCents?: unknown } | undefined;
    if (typeof input?.totalCents !== "number" || !Number.isInteger(input.totalCents)) {
      return { status: 400, body: { error: "totalCents must be an integer" } };
    }
    if (input.totalCents <= 0) {
      return { status: 400, body: { error: "totalCents must be positive" } };
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
