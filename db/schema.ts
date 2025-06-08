import { pgTable } from "@/db/utils";
import { serial, varchar } from "drizzle-orm/pg-core";

export const tags = pgTable("tags", {
	id: serial('id').primaryKey(),
	title: varchar({ length: 128 }),
	description: varchar({ length: 128 }),
	slug: varchar({ length: 128 }),
});

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;

export const categories = pgTable("categories", {
	id: serial('id').primaryKey(),
	name: varchar({ length: 128 }),
	description: varchar({ length: 128 }),
	slug: varchar({ length: 128 }),
  newProps: varchar({ length: 128 }),
});

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

