"use server";

import { Resource } from "@/lib/resources";
import {
  getDataService,
  OrderBy,
  Pagination,
  UpsertData,
  Search,
} from "@/services";
import { userService } from "@/services/user-service";

export async function getAll(
  resource: Resource,
  pagination: Pagination,
  search: Search,
  orderBy: OrderBy[]
) {
  return getDataService(resource).getAll(pagination, search, orderBy);
}

export async function get(resource: Resource, id: number) {
  return await getDataService(resource).get(id);
}

export async function getOptions(resource: Resource) {
  if (resource === 'users') {
    return userService.getOptions();
  }
  
  const options = await getDataService(resource).getOptions();
  
  return options.map((option) => ({
    ...option,
    value: option.value.toString(),
  }));
}

export async function remove(resource: Resource, idList: number[]) {
  await getDataService(resource).delete(idList);
}

export async function upsert(resource: Resource, data: UpsertData) {
  await getDataService(resource).upsert(data);
}