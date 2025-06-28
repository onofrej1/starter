import {
  count,
  eq,
  desc,
  asc,
  inArray,
} from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema";
import { Pagination, OrderBy, Search } from "@/services";
import { filterData } from "@/lib/filter-data";

export const userService = {
  getAll: async (
    pagination: Pagination,    
    search: Search<typeof user>,
    orderBy: OrderBy[],
  ): Promise<[typeof user.$inferSelect[], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const where = filterData({
      table: user,
      filters: filters,
      joinOperator: operator,
    });

    const rowCount = await db
      .select({ count: count() })
      .from(user)
      .where(where)

    const pageCount = Math.ceil(rowCount[0].count / Number(limit));

    const orderByQuery = orderBy.map((item) => {
      const key = item.id as keyof typeof user.$inferInsert;
      return item.desc ? desc(user[key]) : asc(user[key])
    });

    const data = await db.query.user.findMany({
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
        value: user.id,
        label: user.name,
      })
      .from(user);
  },

  get: (id: string) =>
    db.query.user.findFirst({ where: eq(user.id, id) }),

  create: (data: typeof user.$inferInsert) =>
    db.insert(user).values(data).returning(),

  update: (data: typeof user.$inferInsert) =>
    db
      .update(user)
      .set(data)
      .where(eq(user.id, data.id))
      .returning(),

  remove: (idList: string[]) => db.delete(user).where(inArray(user.id, idList)),
};
