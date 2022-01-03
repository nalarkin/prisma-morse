import createError, { isHttpError } from 'http-errors';
import type { UserEdit } from '../common/schema/';
import { logger } from '../loaders/logging';
import * as usersDAL from './usersDAL';

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
    if (isHttpError(err)) {
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
