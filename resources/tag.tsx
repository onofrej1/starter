import { Tag } from "@/generated/prisma";
import { Resource } from "@/types/resources";
import { CreateTag } from "@/validation";

const tag: Resource = {
  name: "Tag",
  name_plural: "Tags",
  model: "tag",
  resource: "tags",
  menuIcon: "",
  rules: CreateTag,
  form: [
    { name: "title", type: "text", label: "Title" },
    { name: "description", type: "text", label: "Description" },
  ],
  list: [
    {
      name: "id",
      header: "Id",
      render: ({ row, cell }) => {
        return (
          <div className="flex items-center gap-3">
            {cell.getValue<string>()} {(row.original as Tag).slug}
          </div>
        );
      },
    },
    { name: "title", header: "Title" },
  ],
};
export { tag };
