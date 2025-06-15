import {
  count,
  eq,
  desc,
  asc,  
} from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { Pagination, DataService, OrderBy, Search } from "@/services";
import { filterData } from "@/lib/filter-data";

export const categoryService: DataService<typeof categories> = {
  getAll: async (
    pagination: Pagination,    
    search: Search<typeof categories>,
    orderBy: OrderBy[],
  ) => {
    const { take, skip } = pagination;
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

    const pageCount = Math.ceil(rowCount[0].count / Number(take));

    const orderByQuery = orderBy.map((item) => {
      const key = item.id as keyof typeof categories.$inferInsert;
      return item.desc ? desc(categories[key]) : asc(categories[key])
    });

    const data = await db
      .select()
      .from(categories)
      .where(where)
      .limit(take)
      .offset(skip)
      .orderBy(...orderByQuery);

    return [ data, pageCount ];
  },

  get: (id: number) =>
    db.query.categories.findFirst({ where: eq(categories.id, Number(id)) }),

  create: (data: typeof categories.$inferInsert) =>
    db.insert(categories).values(data),

  update: (data: typeof categories.$inferInsert) =>
    db
      .update(categories)
      .set(data)
      .where(eq(categories.id, Number(data.id))),
};
