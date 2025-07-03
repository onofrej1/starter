import { tags } from "@/db/schema";
import { BaseService } from "./base";

class TagService extends BaseService<typeof tags, typeof tags.id> {
  constructor() {
    super(tags, tags.id);
  }
}

export const tagService = new TagService();