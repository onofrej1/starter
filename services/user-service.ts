import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { getWhere } from "@/lib/resources";
import { User } from "@/generated/prisma";

export const userService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[User[], number]> => {
    const { limit, offset } = pagination;
    const { filters /*, operator*/ } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });

    const where = getWhere(filters);
    const rowCount = await prisma.user.aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.user.findMany({
      take: limit,
      skip: offset,
      orderBy: orderByQuery,
      where,
    });

    return [data, pageCount];
  },

  get: async (id: string) => {
    return await prisma.user.findFirst({
      where: { id },
    });
  },

  upsert: async (data: User) => {
    if (data.id) {
      await prisma.user.update({ where: { id: data.id }, data });
    } else {
      await prisma.user.create({ data });
    }
  },

  delete: async (id: string[]) => {
    await prisma.user.deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const categories = await prisma.user.findMany();

    return categories.map((user) => ({
      value: user.id,
      label: user.name,
    }));
  },
};
