import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { Category } from "@/generated/prisma";
import { applyFilters } from "@/lib/resources-filter";

export const categoryService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[Category[], number]> => {
    const { limit, offset } = pagination;
    const { filters /*, operator*/ } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });

    const where = applyFilters(filters);

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
    return await prisma.category.findFirst({
      where: { id: Number(id) },
    });
  },

  upsert: async (data: Category) => {
    if (data.id) {
      await prisma.category.update({ where: { id: data.id }, data });
    } else {
      await prisma.category.create({ data });
    }
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

    return categories.map((category) => ({
      value: category.id,
      label: category.name,
    }));
  },
};
