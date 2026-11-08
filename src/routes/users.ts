import type { Db } from "../db.ts";
import type { Router } from "../router.ts";
import { badRequest, isNonEmptyString } from "./validation.ts";

export function registerUserRoutes(router: Router, db: Db): void {
  router.get("/users/:id", (req) => {
    const user = db.users.get(req.params.id ?? "");
    if (!user) return { status: 404, body: { error: "user not found" } };
    return { status: 200, body: user };
  });

  router.post("/users", (req) => {
    const input = req.body as { email?: unknown; name?: unknown } | undefined;
    if (!isNonEmptyString(input?.email) || !input.email.includes("@")) {
      return badRequest("email is required");
    }
    if (!isNonEmptyString(input.name)) return badRequest("name is required");
    const user = { id: db.nextId("usr"), email: input.email, name: input.name.trim() };
    db.users.set(user.id, user);
    return { status: 201, body: user };
  });
}
