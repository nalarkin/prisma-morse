import * as usersDAL from './usersDAL';
import { logger } from '@/loaders/logging';
import { UserEdit } from '@/common/schema/schema_user';
import { BadRequestError, DoesNotExistError } from '@/common';

/**
 * Calls external apis and interal DB api
 */
export async function getAllUsers() {
  return usersDAL.prismaGetAllUsers();
}
export async function getUser(id: number) {
  try {
    const user = await usersDAL.prismaGetUser({ id });
    if (user === null) {
      return new DoesNotExistError('User does not exist');
    }
    return user;
  } catch (err) {
    logger.error('Error occurred when querying user info.');
    return new BadRequestError('Error occurred when querying user info.');
  }
}

export async function deleteUser(id: number) {
  try {
    return await usersDAL.prismaDeleteUser(id);
  } catch (err) {
    logger.error('User does not exist.');
    return new DoesNotExistError('User does not exist');
  }
}

export async function updateUser(id: number, userChange: UserEdit) {
  try {
    return await usersDAL.prismaUpdateUser(id, userChange);
  } catch (e) {
    return new DoesNotExistError('User does not exist');
  }
}
