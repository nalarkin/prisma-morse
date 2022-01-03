import type { UserEdit } from '../common/schema/';
import prisma from '../loaders/database';

export async function prismaGetAllUsers() {
  return prisma.user.findMany();
}

export async function prismaDeleteUser(id: number) {
  return prisma.user.delete({
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
    return getUserFromId(res.id, serializables);
  }
  return getUserFromEmail(res.email, serializables);
}

async function getUserFromEmail(email: string, serializables?: boolean) {
  return prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      serializables,
    },
  });
}

async function getUserFromId(id: number, serializables?: boolean) {
  return prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      serializables,
    },
  });
}

export async function prismaUpdateUser(id: number, userChange: UserEdit) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      ...userChange,
    },
  });
}
