import { Table } from "drizzle-orm";
import { categoryService } from "@/services/category";
import { Filter, Resource } from "@/lib/resources";
import { postService } from "./post";
import { tagService } from "./tag";
import { NewTag } from "@/db/schema";
import { NewCategory } from "@/db/schema";
import { NewPost } from "@/db/schema";
import { userService } from "./user";
import { NewUser } from "@/db/schema";

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
  (NewPost & { tags: number[] }) &
  NewUser;

export function getDataService(resource: Resource) {
  return {
    categories: categoryService,
    tags: tagService,
    posts: postService,
    users: userService,
  }[resource];
}
