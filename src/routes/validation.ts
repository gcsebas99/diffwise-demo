import type { Response } from "../router.ts";

export function badRequest(error: string): Response {
  return { status: 400, body: { error } };
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}
