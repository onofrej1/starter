"use server";

import { DrizzleResource } from "@/lib/resources";
import {
  getDataService,
  OrderBy,
  Pagination,
  ResourceData,
  Search,
} from "@/services";

export async function getAll(
  resource: DrizzleResource,
  pagination: Pagination,
  search: Search,
  orderBy: OrderBy[]
) {
  return getDataService(resource).getAll(pagination, search, orderBy);
}

export async function get(resource: DrizzleResource, id: number) {
  return getDataService(resource).get(id);
}

export async function create(
  resource: DrizzleResource,
  data: ResourceData
) {
  return getDataService(resource).create(data);
}

export async function update(
  resource: DrizzleResource,
  data: ResourceData
) {
  return getDataService(resource).update(data);
}
