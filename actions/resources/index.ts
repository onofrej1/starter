"use server";

import { DrizzleResource, Filter } from "@/lib/resources";
import { getDataService, ResourceData, Sort } from "@/services/resource";
import { Table } from "drizzle-orm";

export async function search(
  resource: DrizzleResource,
  take: number,
  skip: number,
  sort: Sort<Table>[],
  filters: Filter[],
  relations: string[],
  joinOperator: string = "AND") {

  return getDataService(resource).getAll(take, skip, sort, filters, joinOperator);  
}

export async function get(resource: DrizzleResource, id: number) {
  return getDataService(resource).get(id);
}

export async function create(resource: DrizzleResource, data: ResourceData) {
  return getDataService(resource).create(data);
}

export async function update(resource: DrizzleResource, data: ResourceData) {
  return await getDataService(resource).update(data);
}
