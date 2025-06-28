import { /*InferInsertModel, InferSelectModel,*/ Table } from "drizzle-orm";
import { categoryService } from "@/services/category";
import { Filter, Resource } from "@/lib/resources";
import { postService } from "./post";
import { tagService } from "./tag";
//import { QueryResult } from "pg";
import { NewTag } from "@/db/schema/tags";
import { NewCategory } from "@/db/schema/categories";
import { NewPost } from "@/db/schema/posts";

export type Pagination = {
  limit: number;
  offset: number;
};

export type OrderBy = {
  id: string;
  desc: boolean;
};

export type Search<T = Table> = {
  filters: Filter<T>[];
  operator: "and" | "or";
};

export type ResourceData = NewTag &
  NewCategory &
  (NewPost & { tags: number[] });

export function getDataService(
  resource: Resource
) {
  return {
    'categories': categoryService,
    'tags': tagService,
    'posts': postService,
  }[resource];
}
