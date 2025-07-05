import { Table } from "drizzle-orm";
import { Filter, Resource } from "@/lib/resources";
import { categoryService } from "./category-service";
import { postService } from "./post-service";
import { tagService } from "./tag-service";
import { Category, Post, Tag } from "@/generated/prisma";

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


export type SearchParam = {
  filters: Filter[];
  operator: "and" | "or";
};

export type ResourceFormData = Record<string, unknown>;

type Resources = 
| Tag
| Post
| Category;

export type UpsertData = UnionToIntersection<Resources>; 

export type UnionToIntersection<U> = 
  (U extends unknown ? (x: U)=>void : never) extends ((x: infer I)=>void) ? I : never;

type Service =
  | typeof categoryService
  | typeof tagService
  | typeof postService;

const services = new Map<Resource, Service>([
  ["categories", categoryService],
  ["tags", tagService],
  ["posts", postService],
]);

export function getDataService(resource: Resource) {
  if (services.has(resource)) {
    return services.get(resource)!;
  }
  throw new Error('Service not found');
}



