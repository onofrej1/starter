import { categories, type Category, type NewCategory } from "./categories";
import { tags, tagsRelations, type Tag, type NewTag } from "./tags";
import { posts, postsRelations, type Post, type NewPost } from "./posts";
import { postsToTags, postsToTagsRelations } from "./posts-to-tags";
import {
  user,
  session,
  account,
  verification,
  type NewUser,
  type User,
} from "./auth-schema";
export {
  categories,
  tags,
  tagsRelations,
  posts,
  postsRelations,
  postsToTags,
  postsToTagsRelations,
  type Category,
  type NewCategory,
  type Tag,
  type NewTag,
  type Post,
  type NewPost,
  // better-auth models
  user,
  session,
  account,
  verification,
  type User,
  type NewUser,
};
