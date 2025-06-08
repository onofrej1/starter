//import { toggleEnableComments, updateStatus } from "@/actions/posts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { TableData } from "@/types/resources";
import { Resource } from "@/types/resources";
import { CreatePost } from "@/validation";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
//import { toast } from "sonner";
//import { getErrorMessage } from "@/lib/utils";
import React from "react";

const post: Resource = {
  name: "Post",
  name_plural: "Posts",
  model: "post",
  resource: "posts",
  advancedFilter: true,
  rules: CreatePost,
  menuIcon: "",
  relations: ["author", "categories", "tags"],
  filter: [
    //{ name: "title", type: "text", label: "Title" },
    {
      type: "multi-select",
      name: "categories",
      label: "Category",
      resource: "categories",
      //renderOption: (row: Category) => row.title,
      search: "categories_",
    },
    {
      name: "authorId",
      resource: "users",
      search: "author",
      type: "multi-select",
      label: "Author",
      //renderOption: (row: User) => `${row.lastName} ${row.firstName}`,
    },
  ],
  form: [
    { name: "title", type: "text", label: "Title" },
    { name: "content", type: "richtext", label: "Content" },
    { name: "status", type: "text", label: "Status" },
    {
      name: "cover",
      type: "upload",
      label: "Cover",
      dir: 'posts',
    },
    {
      name: "authorId",
      type: "foreignKey",
      relation: "author",
      label: "Author",
      resource: "users",
      renderLabel: (row) => `${row.lastName} ${row.firstName}`,
    },
    {
      name: "categories",
      type: "manyToMany",
      label: "Categories",
      resource: "categories",
      renderLabel: (row) => row.title,
    },
    {
      name: "tags",
      type: "manyToMany",
      label: "Tags",
      resource: "tags",
      renderLabel: (row) => row.title,
    },
  ],
  list: [
    {
      name: "authorId",
      header: "Author",
      render: ({ row }: TableData) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              referrerPolicy={"no-referrer"}
              src={row.author.avatar}
              className="w-10 h-10"
              width={10}
              height={10}
            />
            <AvatarFallback>
              {row.author.firstName?.[0].toUpperCase()}
              {row.author.lastName?.[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {row.author.firstName} {row.author.lastName}
        </div>
      ),
    },
    {
      name: "title",
      header: "Title",
      filter: {
        label: "Title", 
        placeholder: "Search title...",
        //icon: Text,

        variant: "text",
        name: "title",
      },
      render: ({ row }) => <span className="font-semibold">{row.title}</span>,
    },
    { name: "cover", header: "Cover" },
    {
      name: "enableComments",
      header: "Enable comments",
      render: ({ row, queryClient }) => (
        <Switch
          checked={row.enableComments}
          onCheckedChange={async () => {
            //await toggleEnableComments(row.id, !row.enableComments);
            queryClient.invalidateQueries({
              queryKey: ["getResourceData", "posts"],
            });
          }}
        />
      ),
    },
    { name: "status", header: "Status" },
    {
      name: "categories",
      header: "Categories",
      filter: {
        label: "Category", 
        placeholder: "Search categories...",
        //icon: Text,

        variant: "multiSelect",
        name: "categories",
        resource: "categories",
        //renderOption: (row: Category) => row.title,
        search: "categories_",
      },
      /*render: ({ row }) => (
        <span className="flex gap-2">
          {row.categories?.map((category: Category) => (
            <Badge key={category.id} variant="outline">
              {category.title}
            </Badge>
          ))}
        </span>
      ),*/
    },
    {
      name: "actions",
      header: "Actions",
      render: ({ row, queryClient }) => {
        //const [isPending, startTransition] = React.useTransition();

        return (
          <DropdownMenuSub key={"update-status"}>
            <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={row.status}
                onValueChange={async (value) => {
                  //startTransition(async () => {
                    /*await toast.promise(
                      updateStatus(row.id, value as PostStatus),
                      {
                        loading: "Updating...",
                        success: async () => {
                          await queryClient.invalidateQueries({
                            queryKey: ["getResourceData", "posts"],
                          });
                          return "Status updated";
                        },
                        error: (err) => getErrorMessage(err),
                      }
                    );*/
                  //});
                }}
              >
                <DropdownMenuRadioItem
                  key="draft"
                  value="DRAFT"
                  //disabled={isPending}
                >
                  DRAFT
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  key="published"
                  value="PUBLISHED"
                  //disabled={isPending}
                >
                  PUBLISHED
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        );
      },
    },
  ],
};
export { post };
