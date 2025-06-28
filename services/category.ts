import {
  count,
  eq,
  desc,
  asc,  
} from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { Pagination, OrderBy, Search } from "@/services";
import { filterData } from "@/lib/filter-data";

export const categoryService = {
  getAll: async (
    pagination: Pagination,    
    search: Search<typeof categories>,
    orderBy: OrderBy[],
  ): Promise<[typeof categories.$inferSelect[], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const where = filterData({
      table: categories,
      filters: filters,
      joinOperator: operator,
    });

    const rowCount = await db
      .select({ count: count() })
      .from(categories)
      .where(where)

    const pageCount = Math.ceil(rowCount[0].count / Number(limit));

    const orderByQuery = orderBy.map((item) => {
      const key = item.id as keyof typeof categories.$inferInsert;
      return item.desc ? desc(categories[key]) : asc(categories[key])
    });

    const data = await db.query.categories.findMany({
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
        value: categories.id,
        label: categories.name,
      })
      .from(categories);
  },

  get: (id: number) =>
    db.query.categories.findFirst({ where: eq(categories.id, Number(id)) }),

  create: (data: typeof categories.$inferInsert) =>
    db.insert(categories).values(data).returning(),

  update: (data: typeof categories.$inferInsert) =>
    db
      .update(categories)
      .set(data)
      .where(eq(categories.id, Number(data.id)))
      .returning(),
};
