import {
  and,
  or,
  count,
  eq,
  InferInsertModel,
  desc,
  asc,
} from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { getWhereQuery } from "@/lib/resources";
import { ICrudService, Sort } from "./crud-service";

export const categoryService: ICrudService<typeof categories> = {
  getAll: async (
    take: number,
    skip: number,
    sort: Sort<typeof categories>[],
    filters: any,
    joinOperator: string
  ) => {
    const where = getWhereQuery(filters, categories);
    console.log("where", where);

    const numRows = await db
      .select({ count: count() })
      .from(categories)
      .where(and(...where));

    const numPages = Math.ceil(numRows[0].count / Number(take));

    const orderBy = sort.map((item) =>
      item.desc ? desc(categories[item.id]) : asc(categories[item.id])
    );

    const data = await db
      .select()
      .from(categories)
      .where(joinOperator === "AND" ? and(...where) : or(...where))
      .limit(take)
      .offset(skip)
      .orderBy(...orderBy);

    return { data, numPages };
  },

  getOne: (id: string) =>
    db.query.categories.findFirst({ where: eq(categories.id, Number(id)) }),

  create: (data: InferInsertModel<typeof categories>) =>
    db.insert(categories).values(data).returning(),

  update: (data: InferInsertModel<typeof categories>) =>
    db
      .update(categories)
      .set(data)
      .where(eq(categories.id, Number(data.id)))
      .returning(),
};
