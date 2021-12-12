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

interface GetUserOptions {
  serializables?: boolean;
}
type GetUserByID = {
  id: number;
};
type GetUserByEmail = {
  email: string;
};

async function prismaGetUser(res: GetUserByEmail | GetUserByID, options?: GetUserOptions) {
  const serializables = options?.serializables;
  if ('id' in res) {
    const { id } = res;
    return await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        serializables,
      },
    });
  }
  const { email } = res;
  return await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      serializables,
    },
  });
}
// async function primsaMakeAdmin(id: number) {
//   return await prisma.user.update({
//     where: {
//       id,
//     },
//     data: {
//       role: 'ADMIN',
//     },
//   });
// }
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
