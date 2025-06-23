//import { FormField, TableData } from "@/types/resources";
import { categories, posts, tags } from "@/db/schema";
import { FilterVariant } from "@/types/data-table";
import { AnyColumn, eq, ilike, ne, Table } from "drizzle-orm";

export const resources = {
  categories: categories,
  tags: tags,
  posts: posts,
};

/*export enum Resource {
  Categories = 'categories',
  Tags = 'tags',
  Posts = 'posts'
}*/

export type Resource = keyof typeof resources;

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
}

export type Filter<T = Table> = {
  value: string | string[];
  operator: string;  
  variant: FilterVariant;
  search: string;
  id: Extract<keyof T, string>;
}

export function searchResource(resource: Table, filters: Filter[]) {
  //const filters: Filter[] /*Filter<TableData>[]*/ = JSON.parse(input);  
  const query: any[] = []; // eslint-disable-line

  const oper: Record<string, typeof eq | typeof ne | typeof ilike> = {
    eq,
    ne,
    ilike,
  };

  filters.forEach((filter) => {
    let where = {};
    let value = filter.value;
    const operator = filter.operator;
    const key = filter.id; //keyof InferSelectModel<typeof resource>;

    if (["text"].includes(filter.variant)) {
      if (value) {
        value = operator === 'ilike' ? '%'+value+'%' : value;
        // @ts-expect-error eee
        where = oper[operator](resource[key] as AnyColumn, value);
        query.push(where);

      }
    }

    if (["multiSelect"].includes(filter.variant)) {
      if (value) {
        value = operator === 'ilike' ? '%'+value+'%' : value;
        // @ts-expect-error eee
        where = oper[operator](resource[filter.id], value);
        query.push(where);
      }
    }
  });
  console.log('query', query);
  return query;
}

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

/*export function setRelations(
  data: Record<string, any>,
  fields: FormField[],
  entity?: Record<string, any>
) {
  for (const field of fields) {
    if (field.variant === "foreignKey") {
      if (data[field.name]) {
        data[field.relation!] = { connect: { id: data[field.name] } };
      } else {
        data[field.relation!] = { disconnect: true };
      }
      delete data[field.name!];
    }

    if (field.variant === "manyToMany") {
      const values = data[field.name]
        .filter(Boolean)
        .map((value: number) => ({ id: value }));

      if (values && values.length > 0) {
        data[field.name] = getConnectValues(entity?.[field.name], values);
      } else {
        entity?.id ? (data[field.name] = { set: [] }) : delete data[field.name];
      }
    }
  }
}*/
