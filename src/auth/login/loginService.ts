import createError from 'http-errors';
import * as usersDAL from '@/users/usersDAL';
import { ACCESS_JWT_EXPIRE, issueJWT, REFRESH_JWT_EXPIRE, verifyPassword } from '../utils';
import type { User } from '@prisma/client';

export async function isAuthenticated(hashedPassword: string, providedPassword: string) {
  return verifyPassword(hashedPassword, providedPassword);
}

export function createLoginResponseContent(user: Pick<User, 'id' | 'role'>) {
  return {
    access_token: issueJWT(user, ACCESS_JWT_EXPIRE),
    refresh_token: issueJWT(user, REFRESH_JWT_EXPIRE),
  };
}

export async function getLoginInfoFromDatabase(email: string) {
  return await getSingleUser(email);
}

async function getSingleUser(email: string) {
  const user = await usersDAL.prismaGetUser({ email });
  if (user === null) {
    throw createError(401, 'No user exists with the email provided');
  }
  return user;
}
