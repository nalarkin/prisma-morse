import * as usersDAL from './usersDAL';
import { logger } from '@/loaders/logging';
import { UserEdit } from '@/common/schema/schema_user';
import { BadRequestError, DoesNotExistError } from '@/common';
import createError from 'http-errors';

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
      throw createError(404, 'User does not exist');
    }
    return user;
  } catch (err) {
    if (createError.isHttpError(err)) {
      throw err;
    }
    logger.error('Error occurred when querying user info.');
    throw createError(400, 'Error occurred when querying user info.');
  }
}

export async function deleteUser(id: number) {
  try {
    return await usersDAL.prismaDeleteUser(id);
  } catch (err) {
    logger.error('User does not exist.');
    throw createError(404, 'User does not exist');
  }
}

export async function updateUser(id: number, userChange: UserEdit) {
  try {
    return await usersDAL.prismaUpdateUser(id, userChange);
  } catch (e) {
    throw createError(404, 'User does not exist');
  }
}
