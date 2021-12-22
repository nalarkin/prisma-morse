import { AuthenticationError } from '@/common';
import * as usersDAL from '@/users/usersDAL';
import { verifyPassword } from '../utils';
import createError from 'http-errors';

export async function getSingleUser(email: string) {
  const user = await usersDAL.prismaGetUser({ email });
  if (user === null) {
    throw createError(401, 'No user exists with the email provided');
  }
  return user;
}

export async function verifyProvidedPassword(hashedPassword: string, providedPassword: string) {
  return verifyPassword(hashedPassword, providedPassword);
}
