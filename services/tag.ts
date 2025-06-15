import {
  count,
  eq,
  desc,
  asc,  
} from "drizzle-orm";
import { db } from "@/db";
import { tags } from "@/db/schema";
import { Pagination, DataService, OrderBy, Search } from "@/services";
import { filterData } from "@/lib/filter-data";

export const tagService: DataService<typeof tags> = {
  getAll: async (
    pagination: Pagination,    
    search: Search<typeof tags>,
    orderBy: OrderBy[],
  ) => {
    const { take, skip } = pagination;
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

    const pageCount = Math.ceil(rowCount[0].count / Number(take));

    const orderByQuery = orderBy.map((item) => {
      const key = item.id as keyof typeof tags.$inferInsert;
      return item.desc ? desc(tags[key]) : asc(tags[key])
    });

    const data = await db
      .select()
      .from(tags)
      .where(where)
      .limit(take)
      .offset(skip)
      .orderBy(...orderByQuery);

    return [ data, pageCount ];
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
};
