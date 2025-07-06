import { prisma } from "@/db/prisma";
import { faker } from "@faker-js/faker";
import {
  Post,
  User,
  Tag,
  Category,  
} from "@/generated/prisma";
import { NextResponse } from "next/server";
//import bcrypt from "bcryptjs";
//import { slugify } from "@/utils";
const slugify = (str: string) => {
  return str;
}

function random<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)];
}

export async function GET() {
  const count = Array.from({ length: 5 });
  const categories: Partial<Category>[] = [];
  const tags: Partial<Tag>[] = [];

  /*const hashedPassword = await bcrypt.hash(
    process.env.TEST_USER_PASSWORD!,
    Number(process.env.BCRYPT_SALT!)
  );*/

  /*await prisma.user.create({
    data: {
      email: process.env.EMAIL_USER!,
      firstName: "John",
      lastName: "Doe",
      emailVerified: false,
      role: "USER",
      status: "ACTIVE",
      password: hashedPassword,
      lastLogin: new Date(),
    },
  });*/

  for (const i of Array.from({ length: 100 })) {
    let title = faker.lorem.word();
    categories.push({
      name: title,
      description: faker.lorem.sentence(),
      slug: slugify(title),
    });

    title = faker.lorem.word();
    tags.push({
      title,
      description: faker.lorem.sentence(),
      slug: slugify(title),
    });
  }

  await prisma.category.createMany({ data: categories as Category[] });
  await prisma.tag.createMany({ data: tags as Tag[] });

  const users: Partial<User>[] = [];

  const posts: Partial<Post>[] = [];
  //const comments: Partial<Comment>[] = [];
  //const likes: Partial<Like>[] = [];

  for (const [index] of count.entries()) {
    const i = index + 1;
    /*users.push({
      email: `user${i}@example.com`, //faker.internet.email(),
      //firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      emailVerified: false,
      role: "USER",
      status: "ACTIVE",
      password: hashedPassword,
      lastLogin: new Date(),
    });*/
  }

  await prisma.user.createMany({ data: users as User[] });
  const ids = await prisma.user.findMany({ select: { id: true } });
  const userIds = ids.map((i) => i.id);

  for (const [index] of count.entries()) {
    const i = index + 1;

    posts.push({
      title: faker.lorem.word(),
      summary: faker.lorem.paragraph(),
      content: faker.lorem.paragraphs({ min: 3, max: 5 }),
      slug: faker.lorem.slug(),
      authorId: random(userIds),
      status: random(["DRAFT", "PUBLISHED"]),
      metaTitle: faker.lorem.word(),
    });

    /*comments.push({
      comment: faker.lorem.paragraphs({ min: 3, max: 5 }),
      userId: random(userIds),
      postId: i,
      status: "APPROVED",
    });

    likes.push({
      userId: random(userIds),
      postId: i,
    });*/
  }

  await prisma.post.createMany({ data: posts as Post[] });

  /*await prisma.comment.createMany({
    data: comments as Comment[],
  });
  await prisma.like.createMany({ data: likes as Like[] });
  
  await prisma.gallery.createMany({
    data: galleries as Gallery[],
  });*/

  return NextResponse.json({ result: "done" });
}
