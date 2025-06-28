import { pgTable } from "@/db/utils";
import { relations } from "drizzle-orm";
import { date, integer, serial, text, varchar } from "drizzle-orm/pg-core";
import { categories, Category, postsToTags, Tag, user } from ".";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar({ length: 128 }).notNull(),
  content: text(),
  cover: varchar({ length: 258 }).notNull(),
  published: date(),
  categoryId: integer("category_id"),
  userId: integer("user_id"),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
  user: one(user, {
    fields: [posts.userId],
    references: [user.id],
  }),
  tags: many(postsToTags),
}));

export type PostTable = typeof posts;
export type Post = typeof posts.$inferSelect;
export type PostWithCategory = Post & { category: Category }
export type PostWithTags = Post & { tags: Tag[] }
export type NewPost = typeof posts.$inferInsert;
