import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { getInclude, getWhere } from "@/lib/resources";
import { Category } from "@/generated/prisma";

export const categoryService = {
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
    const rowCount = await prisma.category.aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.category.findMany({
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

  upsert: async (data: Category) => {
    await prisma.category.upsert({
      where: {
        id: data.id
      },
      update: data,
      create: data,
    });
  },

  /*create: async (data: Category) => {
    await prisma.category.create({ data });
  },

  update: async (data: Category) => {
    await prisma.category.update({ where: { id: data.id }, data });
  },*/

  delete: async (id: number[]) => {
    await prisma.category.deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const categories = await prisma.category.findMany();
  
    return categories.map(category => ({
      value: category.id,
      label: category.name,
    }));
  },
};
