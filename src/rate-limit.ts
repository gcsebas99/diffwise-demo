import type { Middleware } from "./router.ts";

const WINDOW_MS = 60_000;

export function rateLimit(limit = Number(process.env.RATE_LIMIT_PER_MIN ?? 60)): Middleware {
  const hits = new Map<string, { count: number; windowStart: number }>();
  return (req) => {
    const key = req.user?.id ?? "anonymous";
    const now = Date.now();
    const entry = hits.get(key);
    if (!entry || now - entry.windowStart >= WINDOW_MS) {
      hits.set(key, { count: 1, windowStart: now });
      return undefined;
    }
    entry.count += 1;
    if (entry.count > limit) return { status: 429, body: { error: "too many requests" } };
    return undefined;
  };
}
