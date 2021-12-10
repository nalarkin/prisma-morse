import prisma from '../config/database';

/**
 * Make calls do database in here
 */
export class UsersDAL {
  async getAllUsers() {
    return await prisma.user.findMany();
  }

  async deleteUser(id: number) {
    return await prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async getUser(id: number, includeSerializables = true) {
    return await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        serializables: includeSerializables,
      },
    });
  }
}
