import { InferInsertModel, InferSelectModel, Table } from "drizzle-orm";
import { categoryService } from "@/services/category";
import { DrizzleResource, Filter, Resources } from "@/lib/resources";
import { postService } from "./post";
import { tagService } from "./tag";
import { QueryResult } from "pg";
import { NewTag } from "@/db/schema/tags";
import { NewCategory } from "@/db/schema/categories";
import { NewPost } from "@/db/schema/posts";

export type Pagination = {
  take: number;
  skip: number;
};

export type GetAllReturnType<T extends Table> = [InferSelectModel<T>[], number];

export type OrderBy = {
  id: string;
  desc: boolean;
};

export type Search<T = Table> = {
  filters: Filter<T>[];
  operator: "and" | "or";
};

/*export type ResourceData = { 
  [key: string]: { 
    file: File,
    previousFile: File,
    isDirty: boolean,
  }
} & Record<string, number | string | boolean | null>;*/

export type ResourceData = 
 & NewTag
 & NewCategory
 & NewPost

export interface DataService<T extends Table> {
  getAll: (
    pagination: Pagination,
    search: Search<T>,
    orderBy: OrderBy[]
  ) => Promise<GetAllReturnType<T>>;
  getOptions?: () => Promise<{ value: number, label: string }[]>,
  get: (id: number) => Promise<InferSelectModel<T> | undefined>;
  create: (data: InferInsertModel<T>) => Promise<QueryResult>;
  update: (data: InferInsertModel<T>) => Promise<QueryResult>;
  //delete: (id: string) => Promise<T>;*/
}

export function getDataService(resourceName: DrizzleResource) {
  return {
    [Resources.Categories]: categoryService,
    [Resources.Tags]: tagService,
    [Resources.Posts]: postService,
  }[resourceName];
}
