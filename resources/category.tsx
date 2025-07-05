//import { Category } from "@/db/schema";
import { Category } from "@/generated/prisma";
import { Resource } from "@/types/resources";
import { CreateCategory } from "@/validation";

const category: Resource = {
  name: "Category",
  name_plural: "Categories",
  model: "category",
  resource: "categories",
  menuIcon: "",
  rules: CreateCategory,
  //advancedFilter: true,
  form: [
    { name: "name", type: "text", label: "Name" },
    { name: "description", type: "text", label: "Description" }
  ],
  list: [
    { name: "id", header: "Id" },
    {
      name: "title",
      header: "Name",
      filter: {
        label: "Name",
        placeholder: "Search name...",
        //icon: Text,
        type: "text",
        name: "name",
      },
      render: ({ row }) => {
        return (
          <div className="flex items-center gap-3">
            {(row.original as Category).name}
          </div>
        )
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
