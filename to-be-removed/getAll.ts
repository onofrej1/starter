"use server";

import { Resource } from "@/lib/resources";
import { OrderBy, Pagination, Search } from "@/services";
import { categoryService } from "@/services/category";
import { postService } from "@/services/post";
import { tagService } from "@/services/tag";
import { userService } from "@/services/user";

export async function getAll(
  resource: Resource,
  pagination: Pagination,
  search: Search,
  orderBy: OrderBy[]
) {
  if (resource === "categories") {
    return await categoryService.getAll(pagination, search, orderBy);
  }
  if (resource === "tags") {
    return await tagService.getAll(pagination, search, orderBy);
  }
  if (resource === "posts") {
    return await postService.getAll(pagination, search, orderBy);
  }
  if (resource === "users") {
    return await userService.getAll(pagination, search, orderBy);
  }
}
