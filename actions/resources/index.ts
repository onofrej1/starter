"use server";

import { categories, tags, posts } from "@/db/schema";
import { Filter } from "@/lib/resources";
import { getCrudService, Sort } from "@/services/crud-service";
import { Table } from "drizzle-orm";

export const resources = {
  categories: categories,
  tags: tags,
  posts: posts,
};

export type DrizzleResource = keyof typeof resources;

export async function getAll(
  resource: DrizzleResource,
  take: number,
  skip: number,
  sort: Sort<Table>[],
  filters: Filter[],
  relations: string[],
  joinOperator: string = "AND") {
  
  const crudService = getCrudService(resource);
  const { data, numPages } = await crudService.getAll(take, skip, sort, filters, joinOperator);

  return { data, numPages };
}

type GetResourceProps = {
  resource: DrizzleResource;
  id?: string;
  include: string[]
};

export async function getResource(props: GetResourceProps) {
  const { id, resource, /*include = []*/ } = props;
  if (!id) {
    throw new Error('Wrong request');
  }
  const crudService = getCrudService(resource);
  const data = await crudService.getOne(id);

  return { status: "success", data };
}

type UpdateResourceProps = {
  resource: DrizzleResource;
  data: Record<string, string | number | boolean>;
};

export async function createResource(props: UpdateResourceProps) {
  const { data, resource } = props;
  const crudService = getCrudService(resource);  
  const newData = await crudService.create(data);

  return { status: "success", data: newData };
}

export async function updateResource(props: UpdateResourceProps) {
  const { data, resource } = props;
  const crudService = getCrudService(resource);
  const updatedData = await crudService.update(data);

  return { status: "success", data: updatedData };  
}
