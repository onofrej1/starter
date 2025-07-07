import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { arrayToQuery, setRelations } from "@/lib/resources";
import { Post } from "@/generated/prisma";
import { post } from "@/resources/post";
import { applyFilters } from "@/lib/resources-filter";

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

    const where = applyFilters(filters);
    console.log('where', where);
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
      include: arrayToQuery(["author", "categories", "tags"]),
    });

    return [data, pageCount];
  },

  get: async (id: number) => {
    const data = await prisma.post.findFirst({
      where: { id: Number(id) },
      include: arrayToQuery(["author", "categories", "tags"]),
    });
    return data;
  },

  upsert: async (data: Post) => {
    const oldData = await postService.get(data.id);
    setRelations(data, oldData!, post.form);
    console.log('data', data);

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
