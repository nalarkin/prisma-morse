import { UserEdit } from '@/common/schema/schema_user';
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
  async makeAdmin(id: number) {
    return await prisma.user.update({
      where: {
        id,
      },
      data: {
        role: 'ADMIN',
      },
    });
  }
  async updateUser(id: number, userChange: UserEdit) {
    return await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...userChange,
      },
    });
  }
}
