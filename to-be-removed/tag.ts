import {
  count,
  eq,
  desc,
  asc,
  inArray,
} from "drizzle-orm";
import { db } from "@/db";
import { tags } from "@/db/schema";
import { Pagination, OrderBy, Search } from "@/services";
import { filterData } from "@/lib/filter-data";

export const tagService = {
  getAll: async (
    pagination: Pagination,    
    search: Search<typeof tags>,
    orderBy: OrderBy[],
  ): Promise<[typeof tags.$inferSelect[], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const where = filterData({
      table: tags,
      filters: filters,
      joinOperator: operator,
    });

    const rowCount = await db
      .select({ count: count() })
      .from(tags)
      .where(where)

    const pageCount = Math.ceil(rowCount[0].count / Number(limit));

    const orderByQuery = orderBy.map((item) => {
      const key = item.id as keyof typeof tags.$inferInsert;
      return item.desc ? desc(tags[key]) : asc(tags[key])
    });

    const data = await db.query.tags.findMany({
      limit,
      offset,
      orderBy: orderByQuery,
      where,
    });

    return [ data, pageCount ];
  },

  getOptions: async () => {
    return db
      .select({
        value: tags.id,
        label: tags.title,
      })
      .from(tags);
  },

  get: (id: number) =>
    db.query.tags.findFirst({ where: eq(tags.id, Number(id)) }),

  create: (data: typeof tags.$inferInsert) =>
    db.insert(tags).values(data).returning(),

  update: (data: typeof tags.$inferInsert) =>
    db
      .update(tags)
      .set(data)
      .where(eq(tags.id, Number(data.id)))
      .returning(),

  remove: (idList: number[]) => db.delete(tags).where(inArray(tags.id, idList)),
};
