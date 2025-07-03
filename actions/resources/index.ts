"use server";

import { Resource } from "@/lib/resources";
import {
  getDataService,
  OrderBy,
  Pagination,
  ResourceFormData,
  Search,
} from "@/services";
import { isDataOfType } from "./guards";
import { categoryService } from "@/services/category-service";
import { tagService } from "@/services/tag-service";
import { postService } from "@/services/post-service";
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
  return getDataService(resource).get(id);
}

export async function getOptions(resource: Resource) {
  const options = await getDataService(resource).getOptions();
  return options.map((option) => ({
    ...option,
    value: option.value.toString(),
  }));
}

export async function remove(resource: Resource, idList: number[]) {
  await getDataService(resource).remove(idList);
}

export async function save(resource: Resource, data: ResourceFormData) {
  if (resource === "categories" && isDataOfType("categories", data)) {
    categoryService.save(data);
  } else if (resource === "tags" && isDataOfType("tags", data)) {
    tagService.save(data);
  } else if (resource === "posts" && isDataOfType("posts", data)) {
    postService.save(data);
  } else if (resource === "users" && isDataOfType("users", data)) {
    userService.save(data);
  }
}