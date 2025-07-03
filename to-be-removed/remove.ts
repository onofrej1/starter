"use server";

import { Resource } from "@/lib/resources";
import { categoryService } from "@/services/category";
import { postService } from "@/services/post";
import { userService } from "@/services/user";
import { tagService } from "@/services/tag";

export async function remove(resource: Resource, idList: number[]) {
  if (resource === 'categories') {
    await categoryService.remove(idList);
  }
  if (resource === 'tags') {
    await tagService.remove(idList);
  }
  if (resource === 'posts') {
    await postService.remove(idList);
  }
  if (resource === 'users') {
    await userService.remove(idList);
  }
}
