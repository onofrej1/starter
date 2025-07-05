//import { NewCategory, NewPost, NewTag, NewUser } from "@/db/schema";
//import { Resource } from "@/lib/resources";

import { Category, Post, Tag } from "@/generated/prisma";

interface DataMap {
  categories: Category;
  posts: Post;
  //users: NewUser;
  tags: Tag;
}

const resourceData = {
  categories: "categories",
  posts: "posts",
  tags: "tags",
  users: "user",
};

export const isDataOfType = <K extends keyof DataMap>(
  resourceType: K,
  data: unknown
): data is DataMap[K] => {
  return typeof data === resourceData[resourceType];
};

/*export const isDataOfType1 = <T extends (...args: any) => any>(
  method: T,
  data: unknown,
): data is Parameters<T> => {
  return true;
  //return typeof data === resourceData[resourceType];
};*/

/*export function isCategory(
  resource: Resource,
  data: unknown
): data is NewCategory {
  return resource === "categories";
}
export function isTag(resource: Resource, data: unknown): data is NewTag {
  return resource === "tags";
}

export function isPost(resource: Resource, data: unknown): data is NewPost {
  return resource === "posts";
}

export function isUser(resource: Resource, data: unknown): data is NewUser {
  return resource === "users";
}*/
