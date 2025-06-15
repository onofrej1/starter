import { db } from "@/db/index";
import {
  type Category,
  Post,
  Tag,
  categories,
  posts,
  postsToTags,
  tags,
} from "@/db/schema";
import { random, randomValues } from "@/lib/utils";
import { faker } from "@faker-js/faker";

export async function seedCategories(input: { count: number }) {
  const count = input.count ?? 100;

  try {
    const data = faker.helpers.multiple(createCategory, { count });

    await db.delete(categories);
    await db.insert(categories).values(data).onConflictDoNothing();
  } catch (err) {
    console.error(err);
  }
}

function createCategory(): Omit<Category, "id"> {
  const name = faker.lorem.words(2);

  return {
    name,
    description: faker.lorem.words(2),
    slug: name,
  };
}

export async function seedTags(input: { count: number }) {
  const count = input.count ?? 100;

  try {
    const data = faker.helpers.multiple(createTag, { count });

    await db.delete(tags);
    await db.insert(tags).values(data).onConflictDoNothing();
  } catch (err) {
    console.error(err);
  }
}

function createTag(): Omit<Tag, "id"> {
  const title = faker.lorem.words(2);

  return {
    title,
    description: faker.lorem.words(2),
    slug: title,
  };
}

export async function seedPosts(input: { count: number }) {
  const count = input.count ?? 100;
  const categories = await db.query.categories.findMany({
    columns: {
      id: true,
    },
  });
  const categoryIds = categories.map((category) => category.id);

  try {
    const data = faker.helpers.multiple(() => createPost(categoryIds), {
      count,
    });

    await db.delete(posts);
    await db.insert(posts).values(data).onConflictDoNothing();
  } catch (err) {
    console.error(err);
  }
}

function createPost(categories: number[]): Omit<Post, "id"> {
  const title = faker.lorem.words(2);

  return {
    title,
    content: faker.lorem.words(2),
    cover: faker.lorem.word(),
    categoryId: random(categories) as number,
  };
}

export async function seedPostTags() {
  const posts = await db.query.posts.findMany({
    columns: {
      id: true,
    },
  });
  const postIds = posts.map((post) => post.id);

  const tags = await db.query.tags.findMany({
    columns: {
      id: true,
    },
  });
  const tagIds = tags.map((tag) => tag.id);

  try {
    for (const postId of postIds) {
      const randomTags = randomValues(tagIds, 3, true) as number[];
      await db.insert(postsToTags).values([
        {
          postId,
          tagId: randomTags[0],
        },
        {
          postId,
          tagId: randomTags[1],
        },
        {
          postId,
          tagId: randomTags[2],
        },
      ]);
    }
  } catch (err) {
    console.error(err);
  }
}
