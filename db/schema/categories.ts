import { pgTable } from "@/db/utils";
import { relations } from "drizzle-orm";
import { serial, varchar } from "drizzle-orm/pg-core";
import { posts } from ".";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar({ length: 128 }),
  description: varchar({ length: 128 }),
  slug: varchar({ length: 128 }),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts),
}));

export type CategoryTable = typeof categories;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
