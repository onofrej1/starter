import { count, eq, desc, asc, inArray, and, notInArray } from "drizzle-orm";
import { db } from "@/db";
import { posts, postsToTags } from "@/db/schema";
import { Pagination, DataService, OrderBy, Search } from "@/services";
import { filterData } from "@/lib/filter-data";

export const postService = {
  getAll: async (
    pagination: Pagination,
    search: Search<typeof posts>,
    orderBy: OrderBy[]
  ) => {
    const { take, skip } = pagination;
    const { filters, operator } = search;

    const where = filterData({
      table: posts,
      filters: filters,
      joinOperator: operator,
    });

    const rowCount = await db
      .select({ count: count() })
      .from(posts)
      .where(where);

    const pageCount = Math.ceil(rowCount[0].count / Number(take));

    const orderByQuery = orderBy.map((item) => {
      const key = item.id as keyof typeof posts.$inferInsert;
      return item.desc ? desc(posts[key]) : asc(posts[key]);
    });

    const data = await db
      .select()
      .from(posts)
      .where(where)
      .limit(take)
      .offset(skip)
      .orderBy(...orderByQuery);

    return [data, pageCount];
  },

  getOptions: async () => {
    return db
      .select({
        value: posts.id,
        label: posts.title,
      })
      .from(posts);
  },

  get: (id: number) =>
    db.query.posts.findFirst({
      where: eq(posts.id, Number(id)),
      with: {
        postsToTags: {
          columns: {
            tagId: true,
          },
        },
      },
    }),

  create: async (data: typeof posts.$inferInsert & { tags: number[] }) => {
    const newPost = await db
      .insert(posts)
      .values(data)
      .returning({ insertedId: posts.id });

    if (data.tags.length > 0) {
      const values = data.tags.map((tagId) => ({
        postId: Number(newPost[0].insertedId),
        tagId,
      }));
      await db.insert(postsToTags).values(values).onConflictDoNothing();
    }
  },

  update: async (data: typeof posts.$inferInsert & { tags: number[] }) => {
    console.log("update data", data);
    await db
      .update(posts)
      .set(data)
      .where(eq(posts.id, Number(data.id)));

    if (data.tags.length > 0) {
      await db
        .delete(postsToTags)
        .where(
          and(
            eq(postsToTags.postId, Number(data.id)),
            notInArray(postsToTags.tagId, data.tags)
          )
        );

      const values = data.tags.map((tagId) => ({
        postId: Number(data.id),
        tagId,
      }));

      await db.insert(postsToTags).values(values).onConflictDoNothing();
    }
  },
};
