import { db } from "@/db";
import { postsToTags } from "@/db/schema";
import { and, eq, notInArray } from "drizzle-orm";

export const postToTagsService = {
  create: async (postId: number, tags: number[]) => {
    if (tags.length > 0) {
      const values = tags.map((tagId) => ({
        postId,
        tagId,
      }));
      await db.insert(postsToTags).values(values);
    }
  },

  update: async (postId: number, tags: number[]) => {
    await db
      .delete(postsToTags)
      .where(
        and(eq(postsToTags.postId, postId), notInArray(postsToTags.tagId, tags))
      );

    if (tags.length > 0) {
      const values = tags.map((tagId) => ({
        postId,
        tagId,
      }));

      await db.insert(postsToTags).values(values).onConflictDoNothing();
    }
  },
};
