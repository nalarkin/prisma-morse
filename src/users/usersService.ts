import { UsersDAL } from './usersDAL';
// import logger from 'winston';
import { logger } from '@/loaders/logging';
import { UserEdit } from '@/common/schema/schema_user';

/**
 * Calls external apis and interal DB api
 */
export class UsersService {
  prismaDb: UsersDAL;
  constructor() {
    this.prismaDb = new UsersDAL();
  }

  async getAllUsers() {
    return await this.prismaDb.getAllUsers();
  }

  async getUser(id: number) {
    try {
      return await this.prismaDb.getUser(id);
    } catch (err) {
      logger.error('User does not exist.');
      return null;
    }
  }

  async deleteUser(id: number) {
    try {
      return await this.prismaDb.deleteUser(id);
    } catch (err) {
      logger.error('User does not exist.');
      return null;
    }
  }
  async makeAdmin(id: number) {
    try {
      return await this.prismaDb.deleteUser(id);
    } catch (err) {
      logger.error('User does not exist.');
      return null;
    }
  }

  async updateUser(id: number, userChange: UserEdit) {
    return await this.prismaDb.updateUser(id, userChange);
  }
}
