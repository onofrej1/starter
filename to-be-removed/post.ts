import { count, eq, desc, asc, inArray } from "drizzle-orm";
import { db } from "@/db";
import { Post, posts } from "@/db/schema";
import { Pagination, OrderBy, Search } from "@/services";
import { filterData } from "@/lib/filter-data";
import { postTagsService } from "./post-tags";

export const postService = {
  getAll: async (
    pagination: Pagination,
    search: Search<typeof posts>,
    orderBy: OrderBy[]
  ): Promise<[Post[], number]> => {
    const { limit, offset } = pagination;
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

    const pageCount = Math.ceil(rowCount[0].count / Number(limit));

    const orderByQuery = orderBy.map((item) => {
      const key = item.id as keyof typeof posts.$inferInsert;
      return item.desc ? desc(posts[key]) : asc(posts[key]);
    });

    const data = await db.query.posts.findMany({
      limit,
      offset,
      orderBy: orderByQuery,
      where,
      with: {
        category: true,
        tags: true,
      },
    });

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
        tags: {
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
      postTagsService.create(newPost[0].insertedId, data.tags);
    }
  },

  update: async (data: typeof posts.$inferInsert & { tags: number[] }) => {
    await db
      .update(posts)
      .set(data)
      .where(eq(posts.id, Number(data.id)));

    if (data.tags.length > 0) {
      postTagsService.update(data.id!, data.tags);
    }
  },

  remove: (idList: number[]) =>
    db.delete(posts).where(inArray(posts.id, idList)),
};
