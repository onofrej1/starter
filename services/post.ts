import {
  count,
  eq,
  desc,
  asc,  
} from "drizzle-orm";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { Pagination, DataService, OrderBy, Search } from "@/services";
import { filterData } from "@/lib/filter-data";

export const postService: DataService<typeof posts> = {
  getAll: async (
    pagination: Pagination,    
    search: Search<typeof posts>,
    orderBy: OrderBy[],
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
      .where(where)

    const pageCount = Math.ceil(rowCount[0].count / Number(take));

    const orderByQuery = orderBy.map((item) => {
      const key = item.id as keyof typeof posts.$inferInsert;
      return item.desc ? desc(posts[key]) : asc(posts[key])
    });

    const data = await db
      .select()
      .from(posts)
      .where(where)
      .limit(take)
      .offset(skip)
      .orderBy(...orderByQuery);

    return [ data, pageCount ];
  },

  get: (id: number) =>
    db.query.posts.findFirst({ where: eq(posts.id, Number(id)) }),

  create: (data: typeof posts.$inferInsert) =>
    db.insert(posts).values(data).returning(),

  update: (data: typeof posts.$inferInsert) =>
    db
      .update(posts)
      .set(data)
      .where(eq(posts.id, Number(data.id)))
      .returning(),
};
