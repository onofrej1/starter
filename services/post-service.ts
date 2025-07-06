import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { getInclude, getWhere, setRelations } from "@/lib/resources";
import { Post } from "@/generated/prisma";
import { post } from "@/resources/post";

export const postService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[Post[], number]> => {
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
      include: getInclude("author,categories,tags"),
    });

    return [data, pageCount];
  },

  get: async (id: number) => {
    const data = await prisma.post.findFirst({
      where: { id: Number(id) },
      include: getInclude("author,categories,tags"),
    });
    return data;
  },

  upsert: async (data: Post) => {
    const oldData = await postService.get(data.id);
    console.log("debug:", data, oldData);

    setRelations(data, oldData!, post.form);

    console.log("debug 2:", data);
    if (data.id) {
      const { id, ...rest } = data;
      await prisma.post.update({ where: { id }, data: rest });
    } else {
      await prisma.post.create({ data });
    }
  },

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
