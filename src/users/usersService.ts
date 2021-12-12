import { usersDAL } from './usersDAL';
// import logger from 'winston';
import { logger } from '@/loaders/logging';
import { UserEdit } from '@/common/schema/schema_user';
import { DoesNotExistError } from '@/common';

/**
 * Calls external apis and interal DB api
 */

async function getAllUsers() {
  return await usersDAL.prismaGetAllUsers();
}
async function getUser(id: number) {
  try {
    return await usersDAL.prismaGetUser(id);
  } catch (err) {
    logger.error('User does not exist.');
    return new DoesNotExistError('User does not exist');
  }
}

async function deleteUser(id: number) {
  try {
    return await usersDAL.prismaDeleteUser(id);
  } catch (err) {
    logger.error('User does not exist.');
    return null;
  }
}
// async function makeAdmin(id: number) {
//   try {
//     return await prismaDeleteUser(id);
//   } catch (err) {
//     logger.error('User does not exist.');
//     return null;
//   }
// }

async function updateUser(id: number, userChange: UserEdit) {
  return await usersDAL.prismaUpdateUser(id, userChange);
}

export const usersService = { getAllUsers, getUser, deleteUser, updateUser };
