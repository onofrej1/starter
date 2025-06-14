import {
  //eq,
  InferInsertModel,
  InferSelectModel,
  Table,
} from "drizzle-orm";
import { categoryService } from "@/services/category";
import { DrizzleResource, Filter, Resources } from "@/lib/resources";
//import { tagService } from "@/services/tag";

export type Pagination = {
  take: number;
  skip: number;
}

export type GetAllReturnType<T extends Table> = [ InferSelectModel<T>[], number ]

export type OrderBy = {
  id: string;
  desc: boolean;
};

export type Search = {
  filters: Filter[],
  operator: string
}

export type ResourceData = Record<string, string | number | boolean>;

export interface DataService<T extends Table> {
  getAll: (pagination: Pagination, search: Search, orderBy: OrderBy[]) => Promise<GetAllReturnType<T>>;
  get: (id: number) => Promise<InferSelectModel<T> | undefined>;
  create: (data: InferInsertModel<T>) => Promise<InferInsertModel<T>[]>;
  update: (data: InferInsertModel<T>) => Promise<InferInsertModel<T>[]>;
  //delete: (id: string) => Promise<T>;*/
}

export function getDataService(resourceName: DrizzleResource) {
  switch (resourceName) {
    case Resources.Categories: {
      return categoryService;
    }
    case Resources.Tags: {
      return categoryService;
      //return tagService;
    }
    default: {
      throw new Error("Service not found");
    }
  }
}
