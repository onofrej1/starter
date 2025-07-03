"use server";

import { Resource } from "@/lib/resources";
import { categoryService } from "@/services/category";
import { postService } from "@/services/post";
import { tagService } from "@/services/tag";
import { userService } from "@/services/user";

export async function getOptions(resource: Resource) {
  let options: { value: number; label: string }[] = [];
  if (resource === "categories") {
    options = await categoryService.getOptions();
  }
  if (resource === "posts") {
    options = await postService.getOptions();
  }
  if (resource === "tags") {
    options = await tagService.getOptions();
  }
  if (resource === "users") {
    options = await userService.getOptions();
  }

  return options.map((option) => ({
    ...option,
    value: option.value.toString(),
  }));
}
