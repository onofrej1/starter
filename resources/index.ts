import { Resource } from "@/types/resources";
import { post } from "@/resources/post";
import { category } from "@/resources/category";
import { tag } from "@/resources/tag";

const resources: Resource[] = [
  post,
  category,  
  tag,
];

export { resources };
