import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { getInclude, getWhere } from "@/lib/resources";
import { Post } from "@/generated/prisma";

export const postService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ) => {
    const { limit, offset } = pagination;
    const { filters /*, operator*/ } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });

    const where = getWhere(filters);
    const rowCount = await prisma.post.aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.post.findMany({
      take: limit,
      skip: offset,
      orderBy: orderByQuery,
      where,
    });

    return [data, pageCount];
  },

  get: async (id: number) => {
    const data = await prisma.post.findFirst({
      where: { id: Number(id) },
      include: getInclude(""),
    });
    return data;
  },

  upsert: async (data: Post) => {
    await prisma.post.upsert({
      where: {
        id: data.id,
      },
      update: data,
      create: data,
    });
  },

  /*create: async (data: Post) => {
    await prisma.post.create({ data });
  },

  update: async (data: Post) => {
    await prisma.post.update({ where: { id: data.id }, data });
  },*/

  delete: async (id: number[]) => {
    await prisma.post.deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const posts = await prisma.post.findMany();

    return posts.map((post) => ({
      value: post.id,
      label: post.title,
    }));
  },
};
