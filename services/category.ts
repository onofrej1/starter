import {
  and,
  or,
  count,
  eq,
  desc,
  asc,
} from "drizzle-orm";
import { db } from "@/db";
import { categories, CategoryTable, NewCategory } from "@/db/schema";
import { searchResource } from "@/lib/resources";
import { Pagination, ResourceService, OrderBy, Search } from "./resource";

export const categoryService: ResourceService<CategoryTable> = {
  getAll: async (
    pagination: Pagination,    
    search: Search,
    orderBy: OrderBy<CategoryTable>[],
  ) => {
    const { take, skip } = pagination;
    const { filters, operator } = search;

    const where = searchResource(categories, filters);

    const rowCount = await db
      .select({ count: count() })
      .from(categories)
      .where(and(...where));

    const pageCount = Math.ceil(rowCount[0].count / Number(take));

    const orderByQuery = orderBy.map((item) =>
      item.desc ? desc(categories[item.id]) : asc(categories[item.id])
    );

    const data = await db
      .select()
      .from(categories)
      .where(operator === "AND" ? and(...where) : or(...where))
      .limit(take)
      .offset(skip)
      .orderBy(...orderByQuery);

    return { data, pageCount };
  },

  get: (id: number) =>
    db.query.categories.findFirst({ where: eq(categories.id, Number(id)) }),

  create: (data: NewCategory) =>
    db.insert(categories).values(data).returning(),

  update: (data: NewCategory) =>
    db
      .update(categories)
      .set(data)
      .where(eq(categories.id, Number(data.id)))
      .returning(),
};
