import { UserEdit } from '@/common/schema/schema_user';
import prisma from '@/loaders/database';

/**
 * Make calls do database in here
 */

async function prismaGetAllUsers() {
  return await prisma.user.findMany();
}

async function prismaDeleteUser(id: number) {
  return await prisma.user.delete({
    where: {
      id,
    },
  });
}

async function prismaGetUser(id: number, includeSerializables = true) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      serializables: includeSerializables,
    },
  });
}
async function primsaMakeAdmin(id: number) {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      role: 'ADMIN',
    },
  });
}
async function prismaUpdateUser(id: number, userChange: UserEdit) {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      ...userChange,
    },
  });
}

export const usersDAL = { prismaGetAllUsers, prismaDeleteUser, prismaGetUser, prismaUpdateUser };
