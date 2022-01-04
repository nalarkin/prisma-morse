import { Prisma } from '@prisma/client';
import prisma from '../loaders/database';
export async function searchSerializables(searchString: string) {
  const or: Prisma.SerializableWhereInput = {
    OR: [
      { name: { contains: searchString } },
      { brand: { contains: searchString } },
      { description: { contains: searchString } },
    ],
  };
  return prisma.serializable.findMany({
    where: {
      ...or,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
}
export async function searchConsumables(searchString: string) {
  const or: Prisma.ConsumableWhereInput = {
    OR: [{ name: { contains: searchString } }, { description: { contains: searchString } }],
  };
  return prisma.consumable.findMany({
    where: {
      ...or,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
}
