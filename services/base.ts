import { categories, posts, tags, user } from "@/db/schema";
import { db } from "@/db";
import { eq, inArray, InferInsertModel } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";
import { count, desc, asc } from "drizzle-orm";
import { Pagination, OrderBy, Search } from "@/services";
import { filterData } from "@/lib/filter-data";

type Tables = typeof categories | typeof tags | typeof posts | typeof user;

export class BaseService<Schema extends Tables, PkColumn extends PgColumn> {
  protected schema: Tables;
  protected primaryKeyColumn: PkColumn;

  constructor(schema: Schema, primaryKeyColumn: PkColumn) {
    this.schema = schema;
    this.primaryKeyColumn = primaryKeyColumn;
  }

  async getAll(
    pagination: Pagination,
    search: Search<typeof this.schema>,
    orderBy: OrderBy[]
  ): Promise<[(typeof this.schema.$inferSelect)[], number]> {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const where = filterData({
      table: this.schema,
      filters: filters,
      joinOperator: operator,
    });

    const rowCount = await db
      .select({ count: count() })
      .from(this.schema)
      .where(where);

    const pageCount = Math.ceil(rowCount[0].count / Number(limit));

    const orderByQuery = orderBy.map((item) => {
      const key = item.id as keyof typeof this.schema.$inferInsert;
      return item.desc ? desc(this.schema[key]) : asc(this.schema[key]);
    });

    const data = await db
      .select()
      .from(this.schema)
      .limit(limit)
      .offset(offset)
      .orderBy(...orderByQuery)
      .where(where);
    /*const data = await db.query.this.findMany({
      limit,
      offset,
      orderBy: orderByQuery,
      where,
    });*/

    return [data, pageCount];
  }

  async getOptions() {
    return db
      .select({
        value: this.primaryKeyColumn,
        label: categories.name,
      })
      .from(this.schema);
  }

  async get(id: number, column?: PgColumn) {
    const result = await db
      .select()
      .from(this.schema)
      .where(eq(column ?? this.primaryKeyColumn, id))
      .limit(1);

    return result?.[0];
  }

  async remove(idList: number[]) {
    await db.delete(this.schema).where(inArray(this.primaryKeyColumn, idList));
  }

  /*async delete(value: string, column?: PgColumn) {
    const results = await db
      .delete(this.schema)
      .where(eq(column ?? this.primaryKeyColumn, value))
      .returning();

    return results?.[0];
  }*/

  async save(payload: InferInsertModel<Schema>, conflictTarget?: PgColumn) {
    const results = await db
      .insert(this.schema)
      .values(payload)
      .onConflictDoUpdate({
        target: conflictTarget ?? this.primaryKeyColumn,
        set: payload,
      })
      .returning();

    return results?.[0];
  }
}
