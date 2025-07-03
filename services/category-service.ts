import { categories } from "@/db/schema";
import { BaseService } from "./base";

class CategoryService extends BaseService<typeof categories, typeof categories.id> {
  constructor() {
    super(categories, categories.id);
  }
}

export const categoryService = new CategoryService();