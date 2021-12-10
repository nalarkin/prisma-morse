import { UsersDAL } from './usersDAL';
// import logger from 'winston';
import { logger } from '../config/logging';

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
}
