import { pgTable } from "@/db/utils";
import { relations } from "drizzle-orm";
import { integer, serial, varchar } from "drizzle-orm/pg-core";
import { categories, postsToTags } from ".";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar({ length: 128 }).notNull(),
  content: varchar({ length: 128 }),
  cover: varchar({ length: 128 }).notNull(),
  categoryId: integer("category_id"),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
  postsToTags: many(postsToTags),
}));

export type PostTable = typeof posts;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
