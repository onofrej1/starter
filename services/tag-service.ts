import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { getWhere } from "@/lib/resources";
import { Tag } from "@/generated/prisma";
import { getWhereQuery } from "@/lib/resources-filter";

export const tagService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[Tag[], number]> => {
    const { limit, offset } = pagination;
    const { filters /*, operator*/ } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });

    const where = getWhereQuery(filters);
    const rowCount = await prisma.tag.aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.tag.findMany({
      take: limit,
      skip: offset,
      orderBy: orderByQuery,
      where,
    });

    return [data, pageCount];
  },

  get: async (id: number) => {
    return await prisma.tag.findFirst({
      where: { id: Number(id) },
    });
  },

  upsert: async (data: Tag) => {
    if (data.id) {
      await prisma.tag.update({ where: { id: data.id }, data });
    } else {
      await prisma.tag.create({ data });
    }
  },

  /*create: async (data: Tag) => {
    await prisma.tag.create({ data });
  },

  update: async (data: Tag) => {
    await prisma.tag.update({ where: { id: data.id }, data });
  },*/

  delete: async (id: number[]) => {
    await prisma.tag.deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const tags = await prisma.tag.findMany();

    return tags.map((tag) => ({
      value: tag.id,
      label: tag.title,
    }));
  },
};
