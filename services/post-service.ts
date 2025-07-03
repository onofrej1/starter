import { posts } from "@/db/schema";
import { BaseService } from "./base";

class PostService extends BaseService<typeof posts, typeof posts.id> {
  constructor() {
    super(posts, posts.id);
  }
}

export const postService = new PostService();