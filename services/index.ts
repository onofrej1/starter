import { Table } from "drizzle-orm";
import { Filter, Resource } from "@/lib/resources";
import { NewTag } from "@/db/schema";
import { NewCategory } from "@/db/schema";
import { NewPost } from "@/db/schema";
import { NewUser } from "@/db/schema";
import { categoryService } from "./category-service";
import { tagService } from "./tag-service";
import { postService } from "./post-service";
import { userService } from "./user-service";

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
export type ResourceFormData = NewTag | NewCategory | NewUser | NewPost;

type Service =
  | typeof categoryService
  | typeof tagService
  | typeof postService
  | typeof userService;

const services = new Map<Resource, Service>([
  ["categories", categoryService],
  ["tags", tagService],
  ["posts", postService],
  ["users", userService],
]);

export function getDataService(resource: Resource) {
  if (services.has(resource)) {
    return services.get(resource)!;
  }
  throw new Error('Service not found');
}



