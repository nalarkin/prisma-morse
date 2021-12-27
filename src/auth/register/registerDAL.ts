import prisma from '../../loaders/database';
import type { User } from '@prisma/client';

export type NewUser = Pick<User, 'firstName' | 'lastName' | 'email' | 'password' | 'unsafePassword'>;
/** Creates a new user in the database */
export async function createUser(user: NewUser) {
  return prisma.user.create({
    data: { ...user },
  });
}
