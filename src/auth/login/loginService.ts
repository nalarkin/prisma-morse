import { AuthenticationError } from '@/common';
import { usersDAL } from '@/users/usersDAL';
import { verifyPassword } from '../utils';

async function getSingleUser(email: string) {
  const user = await usersDAL.prismaGetUser({ email });
  if (user === null) {
    return new AuthenticationError('No user exists with the email provided');
  }
  return user;
}

async function verifyProvidedPassword(hashedPassword: string, providedPassword: string) {
  return await verifyPassword(hashedPassword, providedPassword);
}

export const loginService = { getSingleUser, verifyProvidedPassword };
