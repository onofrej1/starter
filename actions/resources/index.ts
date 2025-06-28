"use server";

import { Resource } from "@/lib/resources";
import {
  getDataService,
  OrderBy,
  Pagination,
  ResourceData,
  Search,
} from "@/services";

export async function getAll(
  resource: Resource,
  pagination: Pagination,
  search: Search,
  orderBy: OrderBy[]
) {
  return getDataService(resource).getAll(pagination, search, orderBy);
}

export async function get(resource: Resource, id: number) {
  return getDataService(resource).get(id);
}

export async function getOptions(resource: Resource) {
  const options = await getDataService(resource).getOptions();
  return options.map(option => ({ ...option, value: option.value.toString() }));
}

export async function create(
  resource: Resource,
  data: ResourceData
) {
  await getDataService(resource).create(data);
}

export async function update(
  resource: Resource,
  data: ResourceData
) {
  await getDataService(resource).update(data);
}

export async function remove(resource: Resource, idList: number[]) {
  await getDataService(resource).remove(idList);
}
