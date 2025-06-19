import { pgTable } from "@/db/utils";
import { serial, varchar } from "drizzle-orm/pg-core";

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  title: varchar({ length: 128 }).notNull(),
  description: varchar({ length: 128 }),
  slug: varchar({ length: 128 }),
});

export type TagTable = typeof tags;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
