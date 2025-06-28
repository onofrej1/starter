//import { toggleEnableComments, updateStatus } from "@/actions/posts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
//import { Badge } from "@/components/ui/badge";
//import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Post } from "@/db/schema";
import { PostWithCategory } from "@/db/schema/posts";
//import { posts } from "@/db/schema";
import { Resource } from "@/types/resources";
import { CreatePost } from "@/validation";
/*import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";*/
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
  /*filter: [
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
  ],*/
  form: [
    { name: "title", type: "text", label: "Title" },
    { name: "content", type: "text", label: "Content" },
    //{ name: "status", type: "text", label: "Status" },
    {
      name: "cover",
      type: "text",
      label: "Cover",
      //dir: 'posts',
    },
    {
      name: "categoryId",
      type: "foreignKey",
      relation: "category",
      label: "Category",
      resource: "categories",
      renderLabel: (row) => `${row.name}`,
    },
    /*{
      name: "authorId",
      type: "foreignKey",
      relation: "author",
      label: "Author",
      resource: "users",
      renderLabel: (row) => `${row.lastName} ${row.firstName}`,
    },*/
    /*{
      name: "categories",
      type: "manyToMany",
      label: "Categories",
      resource: "categories",
      renderLabel: (row) => row.title,
    },*/
    {
      name: "tags",
      type: "manyToMany",
      label: "Tags",
      resource: "tags",
      field: 'tagId',
      renderLabel: (row) => row.title,
    },
  ],
  list: [
    {
      name: "authorId",
      header: "Author",
      render: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              referrerPolicy={"no-referrer"}
              src={''}
              className="w-10 h-10"
              width={10}
              height={10}
            />
            <AvatarFallback>
              {(row.original as Post).title}
              {/*row.author.firstName?.[0].toUpperCase()*/}
              {/*row.author.lastName?.[0].toUpperCase()*/}
            </AvatarFallback>
          </Avatar>
          {/*row.author.firstName*/} {/*row.author.lastName*/}
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
        type: "text",
        name: "title",
      },
      render: ({ row }) => <span className="font-semibold">{(row.original as Post).title}</span>,
    },
    { name: "cover", header: "Cover" },
    {
      name: "enableComments",
      header: "Enable comments",
      render: ({ row }, queryClient ) => (
        <Switch
          checked={false/*row.enableComments*/}
          onCheckedChange={async () => {
            console.log(row);
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

        type: "multiSelect",
        name: "categories",
        resource: "categories",
        //renderOption: (row: Category) => row.title,
        search: "categories_",
      },
      render: ({ row }) => (
        <span className="flex gap-2">
          {(row.original as PostWithCategory).category.name}

          {/*(row.original as Post).categories?.map((category: Category) => (
            <Badge key={category.id} variant="outline">
              {category.title}
            </Badge>
          ))*/}
        </span>
      ),
    },
    
  ],
};
export { post };
