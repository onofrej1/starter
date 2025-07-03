"use server";

import { Resource } from "@/lib/resources";
import { categoryService } from "@/services/category";
import { postService } from "@/services/post";
import { userService } from "@/services/user";
import { tagService } from "@/services/tag";

export async function get(resource: Resource, id: number) {
  if (resource === "categories") {
    await categoryService.get(id);
  }
  if (resource === "tags") {
    await tagService.get(id);
  }
  if (resource === "posts") {
    await postService.get(id);
  }
  if (resource === "users") {
    await userService.get(id);
  }
}
