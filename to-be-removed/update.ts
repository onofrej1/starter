"use server";

import { Resource } from "@/lib/resources";
import { ResourceFormData } from "@/services";
import { isDataOfType } from "./guards";
import { categoryService } from "@/services/category";
import { postService } from "@/services/post";
import { userService } from "@/services/user";
import { tagService } from "@/services/tag";

export async function update(resource: Resource, data: ResourceFormData) {
  if (resource === "categories" && isDataOfType("categories", data)) {
    await categoryService.update(data);
  }
  if (resource === "posts" && isDataOfType("posts", data)) {
    await postService.update(data);
  }
  if (resource === "tags" && isDataOfType("tags", data)) {
    await tagService.update(data);
  }
  if (resource === "users" && isDataOfType("users", data)) {
    await userService.update(data);
  }
}
