import type { Migration } from "./types.ts";

export const migration: Migration = {
  id: "003_add_order_notes",
  up: `
    ALTER TABLE orders ADD COLUMN notes TEXT;
    ALTER TABLE orders ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
  `,
};
