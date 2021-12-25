import createError from 'http-errors';
import * as usersDAL from '@/users/usersDAL';
import { ACCESS_JWT_EXPIRE, issueJWT, REFRESH_JWT_EXPIRE, verifyPassword } from '../utils';
import type { User } from '@prisma/client';
import { ajv, SCHEMA } from '@/common';
import type { LoginForm } from '@/common';

async function getSingleUser(email: string) {
  const user = await usersDAL.prismaGetUser({ email });
  if (user === null) {
    throw createError(401, 'No user exists with the email provided');
  }
  return user;
}

export async function isAuthenticated(hashedPassword: string, providedPassword: string) {
  return verifyPassword(hashedPassword, providedPassword);
}

export function createLoginResponseContent(user: Pick<User, 'id' | 'role'>) {
  return {
    access_token: issueJWT(user, ACCESS_JWT_EXPIRE),
    refresh_token: issueJWT(user, REFRESH_JWT_EXPIRE),
  };
}

/** Ensure that provided body meets expected format for login */
export function validateLoginForm(body: unknown) {
  const validator = ajv.getSchema<LoginForm>(SCHEMA.LOGIN);
  if (validator === undefined) {
    throw createError(500, 'Unable to retrieve validator for login');
  }
  if (!validator(body)) {
    throw createError(400, ajv.errorsText(validator.errors));
  }
  return body;
}

export async function getLoginInfoFromDatabase(email: string) {
  const { id, role, password } = await getSingleUser(email);
  return { id, role, password };
}
