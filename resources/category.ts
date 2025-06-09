import { categories } from "@/db/schema";
import { Resource } from "@/types/resources";
import { CreateCategory } from "@/validation";

const category: Resource<typeof categories> = {
  name: "Category",
  name_plural: "Categories",
  model: "category",
  resource: "categories",
  menuIcon: "",
  rules: CreateCategory,
  form: [
    { name: "name", type: "text", label: "Name" },
    { name: "description", type: "text", label: "Description" }
  ],
  list: [
    { name: "id", header: "Id" },
    {
      name: "name",
      header: "Name",
      filter: {
        label: "Name",
        placeholder: "Search name...",
        //icon: Text,
        type: "text",
        name: "name",
      },
    },
    {
      name: "description",
      header: "Description",
      filter: {
        label: "Description",
        placeholder: "Search description...",
        //icon: Text,
        type: "text",
        name: "description",
      },
    },
  ],
};
export { category };
