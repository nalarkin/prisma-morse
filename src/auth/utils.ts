/**
 * Provides utility functions for authentication.
 *
 * As of now, this includes password hashing + validation and JWT creation + validation.
 * While there is a validation function in this module, the majority of JWT validation
 * is done using the Passport library.
 */

import type { User } from '@prisma/client';
import type { Options } from 'argon2';
import { argon2id, hash, verify } from 'argon2';
import fs from 'fs';
import createError from 'http-errors';
import type { SignOptions } from 'jsonwebtoken';
import { sign, verify as verifyJWT } from 'jsonwebtoken';
import path from 'path';
import { JWTPayloadRequest } from '../common/schema/schema_jwt';
import { getValidator, SCHEMA } from '../common/validation';

// numeric value = seconds
export const ACCESS_JWT_EXPIRE: SignOptions['expiresIn'] = 15;
export const REFRESH_JWT_EXPIRE: SignOptions['expiresIn'] = '7d';

const pathToPrivateKey = path.join(__dirname, 'token', 'id_rsa_priv.pem');
// eslint-disable-next-line security/detect-non-literal-fs-filename
const PRIV_KEY = fs.readFileSync(pathToPrivateKey, 'utf8');

/**
 * ecomendations listed here:
 * https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id
 */
export const hashOptions: Options & { raw: false } = {
  type: argon2id,
  timeCost: 2,
  memoryCost: 2 ** 14,
  parallelism: 1,
  raw: false,
};

export const defaultOption = {
  type: argon2id,
};

// hash password with argon2id for maximum security, this is what gets stored in the database for password
export async function hashPassword(password: string) {
  return await hash(password, hashOptions);
}

// compare user password during login with the hashed password in database
export async function verifyPassword(hashed: string, pw: string) {
  return await verify(hashed, pw, {
    type: argon2id,
  });
}

export type JWTData = {
  sub: User['id'];
  role: User['role'];
};

function signToken(payload: JWTData, expiresIn: SignOptions['expiresIn']) {
  // works for keys with no passphrase and keys with passphrase if .env variable matches correctly
  return sign(
    payload,
    { key: PRIV_KEY, passphrase: process.env.RSA_PASSPHRASE ?? '' },
    {
      expiresIn: expiresIn,
      algorithm: 'RS256',
    },
  );
}

function createPayload({ id, role }: Pick<User, 'id' | 'role'>) {
  return { sub: id, role };
}

/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the MySQL user ID
 */
export function issueJWT(user: Pick<User, 'id' | 'role'>, expiresIn: SignOptions['expiresIn']) {
  // this gets stored in jwt, store id to query database for role on each request
  // store the role so the front end UI can display the proper UI
  return `${signToken(createPayload(user), expiresIn)}`;
}

export function validateJWT(token: string) {
  const validator = getValidator<JWTPayloadRequest>(SCHEMA.JWT_REQUEST);
  const result = verifyJWT(token, PRIV_KEY, { algorithms: ['RS256'] });
  if (validator(result)) {
    return result;
  }
  throw createError(400, 'Invalid JWT Format was provided');
}

// export function tokenIsExpired(expireDate: number) {
//   return dayjs().isAfter(dayjs(expireDate * 1000));
// }
