import { pgTable } from "@/db/utils";
import { relations } from "drizzle-orm";
import { integer, serial, varchar } from "drizzle-orm/pg-core";
import { categories } from ".";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar({ length: 128 }),
  content: varchar({ length: 128 }),
  cover: varchar({ length: 128 }),
  categoryId: integer("category_id"),
});

export const postsRelations = relations(posts, ({ one }) => ({
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
}));

export type PostTable = typeof posts;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
