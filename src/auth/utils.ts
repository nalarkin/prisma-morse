import { argon2id, Options, hash, verify } from 'argon2';
import { SignOptions, sign, verify as verifyJWT } from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { User } from '@prisma/client';
import dayjs from 'dayjs';

export const ACCESS_JWT_EXPIRE: SignOptions['expiresIn'] = 15;
export const REFRESH_JWT_EXPIRE: SignOptions['expiresIn'] = '7d';

const pathToPrivateKey = path.join(__dirname, 'token', 'id_rsa_priv.pem');
// eslint-disable-next-line security/detect-non-literal-fs-filename
const PRIV_KEY = fs.readFileSync(pathToPrivateKey, 'utf8');

/** Recomendations listed here:
 * https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id
 *
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
  sub: number;
  role: User['role'];
};

/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the MySQL user ID
 */
export function issueJWT(user: User, expiresIn: SignOptions['expiresIn']) {
  const { id, role } = user;

  // this gets stored in jwt, store id to query database for role on each request
  // store the role so the front end UI can display the proper UI
  const payload: JWTData = {
    sub: id,
    role: role,
  };

  // works for keys with ao passphrase and keys with passphrase if .env variable matches correctly
  const signedToken = sign(
    payload,
    { key: PRIV_KEY, passphrase: process.env.RSA_PASSPHRASE ?? '' },
    {
      expiresIn: expiresIn,
      algorithm: 'RS256',
    },
  );

  return `${signedToken}`;
}

export function validateJWT(token: string) {
  return verifyJWT(token, PRIV_KEY, { algorithms: ['RS256'] });
}

export function tokenIsExpired(expireDate: number) {
  return dayjs().isAfter(dayjs(expireDate * 1000));
}

// export function tokenIsExpired(token: string) {}
