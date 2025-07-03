import { NewCategory, NewPost, NewTag, NewUser } from "@/db/schema";
//import { Resource } from "@/lib/resources";

interface DataMap {
  categories: NewCategory;
  posts: NewPost;
  users: NewUser;
  tags: NewTag;
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
