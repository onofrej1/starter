//import { FormField, TableData } from "@/types/resources";
//import { categories, posts, tags, user } from "@/db/schema";
import { prisma } from "@/db/prisma";
import { FilterVariant } from "@/types/data-table";
import { FormField } from "@/types/resources";
import { Table } from "drizzle-orm";

export const resources = {
  categories: prisma.category,
  tags: prisma.tag,
  posts: prisma.post,
  //users: user,
};

/*export enum Resource {
  Categories = 'categories',
  Tags = 'tags',
  Posts = 'posts'
}*/

export type Resource = keyof typeof resources | "users";

export function getOrderBy(input: string) {
  if (!input) {
    return [{ id: "asc" }];
  }

  const sort: { id: string; desc: boolean }[] = JSON.parse(input);
  return sort.map((value) => ({ [value.id]: value.desc ? "desc" : "asc" }));
}

export type FilterOld = {
  id: string;
  value: string | string[];
  operator: string;
  variant: FilterVariant;
  search: string;
};

export type Filter<T = Table> = {
  value: string | string[];
  operator: string;
  variant: FilterVariant;
  search: string;
  id: Extract<keyof T, string>;
};

export function getRelations(query?: string | string[]) {
  if (!query) {
    return {};
  }
  if (typeof query === "string") {
    return reduceQuery(query.split(","));
  }
  return reduceQuery(query);
}

export function reduceQuery(query: string[]) {
  return query.reduce((result, model) => {
    result[model] = true;
    return result;
  }, {} as Record<string, boolean>);
}

/*export function getWhere(where: Record<string, any>) {
  return Object.keys(where).reduce((acc, k) => {
    const value = where[k];
    if (value !== "") {
      const [op, val] = value.split(",");
      acc[k] = { [op]: val };
    }
    return acc;
  }, {} as Record<string, unknown>);
}*/

export function getInclude(includeModels: string) {
  if (!includeModels) {
    return {};
  }
  return includeModels.split(",").reduce((acc, model) => {
    acc[model] = true;
    return acc;
  }, {} as Record<string, true>);
}

type BaseEntity = {
  id: number | string;
  [key: string]: unknown,
}

function getConnectValues(
  oldValues: BaseEntity[] = [],
  newValues: BaseEntity[]
) {
  if (newValues.length === 0) {
    return { set: [] };
  }

  const newIds = new Set(newValues.map((item) => item.id));

  const connect = Array.from(newIds)
    .filter((id) => !oldIds.has(id))
    .map((id) => ({ id }));

  if (oldValues.length === 0) {
    return {
      connect,
    };
  }

  const oldIds = new Set(oldValues.map((item) => item.id));
  const disconnect = Array.from(oldIds)
    .filter((id) => !newIds.has(id))
    .map((id) => ({ id }));

  return {
    connect,
    disconnect,
  };
}

type Data = Record<string, unknown>;

export function setRelations(
  data: Data,
  oldData: Data | null,
  fields: FormField[],
) {
  const newData = {...data};
  for (const field of fields) {
    const key = field.name;
    if (field.type === "foreignKey") {
      if (newData[key]) {
        newData[field.relation!] = { connect: { id: newData[key] } };
      } else {
        newData[field.relation!] = { disconnect: true };
      }
      delete newData[key];
    }

    if (field.type === "manyToMany") {
      const values = (newData[key] as number[])
        .filter(Boolean)
        .map((value: number) => ({ id: value }));

      const oldValues = oldData?.[key] as BaseEntity[];

      if (values && values.length > 0) {
        newData[key] = getConnectValues(oldValues, values);
      } else {
        if (oldData?.id) {
          newData[key] = { set: [] }
        } else {
          delete newData[key];
        }
      }
    }
  }
}
