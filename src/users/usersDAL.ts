import { UserEdit } from '@/common/schema/schema_user';
import prisma from '@/loaders/database';

/**
 * Make calls do database in here
 */
export async function prismaGetAllUsers() {
  return await prisma.user.findMany();
}

export async function prismaDeleteUser(id: number) {
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

export async function prismaGetUser(res: GetUserByEmail | GetUserByID, options?: GetUserOptions) {
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

export async function prismaUpdateUser(id: number, userChange: UserEdit) {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      ...userChange,
    },
  });
}

// export const usersDAL = { prismaGetAllUsers, prismaDeleteUser, prismaGetUser, prismaUpdateUser };
