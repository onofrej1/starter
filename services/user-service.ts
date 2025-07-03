import { user } from "@/db/schema";
import { BaseService } from "./base";

class UserService extends BaseService<typeof user, typeof user.id> {
  constructor() {
    super(user, user.id);
  }
}

export const userService = new UserService();