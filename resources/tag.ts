import { tags } from "@/db/schema";
import { Resource } from "@/types/resources";
import { CreateTag } from "@/validation";

const tag: Resource<typeof tags> = {
  name: "Tag",
  name_plural: "Tags",
  model: "tag",
  resource: "tags",
  menuIcon: "",
  rules: CreateTag,
  form: [{ name: "title", type: "text", label: "Title" }],
  list: [
    { name: "id", header: "Id" },
    { name: "title", header: "Title" },
  ],
};
export { tag };
