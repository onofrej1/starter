import {
  count,
  eq,
  desc,
  asc,  
} from "drizzle-orm";
import { db } from "@/db";
import { [TABLE] } from "@/db/schema";
import { Pagination, DataService, OrderBy, Search } from "@/services";
import { filterData } from "@/lib/filter-data";

export const [NAME]Service: DataService<typeof [TABLE]> = {
  getAll: async (
    pagination: Pagination,    
    search: Search<typeof [TABLE]>,
    orderBy: OrderBy[],
  ) => {
    const { take, skip } = pagination;
    const { filters, operator } = search;

    const where = filterData({
      table: [TABLE],
      filters: filters,
      joinOperator: operator,
    });

    const rowCount = await db
      .select({ count: count() })
      .from([TABLE])
      .where(where)

    const pageCount = Math.ceil(rowCount[0].count / Number(take));

    const orderByQuery = orderBy.map((item) => {
      const key = item.id as keyof typeof [TABLE].$inferInsert;
      return item.desc ? desc([TABLE][key]) : asc([TABLE][key])
    });

    const data = await db
      .select()
      .from([TABLE])
      .where(where)
      .limit(take)
      .offset(skip)
      .orderBy(...orderByQuery);

    return [ data, pageCount ];
  },

  get: (id: number) =>
    db.query.[TABLE].findFirst({ where: eq([TABLE].id, Number(id)) }),

  create: (data: typeof [TABLE].$inferInsert) =>
    db.insert([TABLE]).values(data).returning(),

  update: (data: typeof [TABLE].$inferInsert) =>
    db
      .update([TABLE])
      .set(data)
      .where(eq([TABLE].id, Number(data.id)))
      .returning(),
};
