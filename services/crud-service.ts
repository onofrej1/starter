import {
  eq,
  InferInsertModel,
  InferSelectModel,
  Table,
} from "drizzle-orm";
import { categoryService } from "./category-service";
import { DrizzleResource } from "@/actions/resources";

export type Pagination = {
  take: number;
  skip: number;
}

export type GetAllData<T extends Table> = {
  data: InferSelectModel<T>[];
  numPages: number;
}

export type Sort<T extends Table> = {
  id: keyof InferSelectModel<T>;
  desc: boolean;
};

export interface ICrudService<T extends Table> {
  getAll: (take: number, skip: number, sort: Sort<T>[], filters: any, joinOperator: string) => Promise<getAllData<T>>;
  getOne: (id: string) => Promise<InferSelectModel<T> | undefined>;
  create: (data: InferInsertModel<T>) => Promise<InferInsertModel<T>[]>;
  update: (data: InferInsertModel<T>) => Promise<InferInsertModel<T>[]>;
  //delete: (id: string) => Promise<T>;*/
}

export function getCrudService(resource: DrizzleResource) {
  switch (resource) {
    case "categories": {
      return categoryService;
      break;
    }
    /*case "tags": {
      return tagService;
      break;
    }*/
    default: {
      throw new Error("Service not found");
    }
  }
}
