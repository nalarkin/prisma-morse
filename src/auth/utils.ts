import argon2, { argon2id, Options } from 'argon2';
import jsonwebtoken from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { User } from '@prisma/client';

const pathToPrivateKey = path.join(__dirname, 'tokens', 'id_rsa_priv.pem');
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
  return await argon2.hash(password, hashOptions);
}

// compare user password during login with the hashed password in database
export async function verifyPassword(hashed: string, pw: string) {
  return await argon2.verify(hashed, pw, {
    type: argon2id,
  });
}

/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the MySQL user ID
 */
export function issueJWT(user: User) {
  const { id } = user;

  const expiresIn = '1d';

  // this gets stored in jwt, store id to query database for role on each request
  const payload = {
    sub: id,
    iat: Date.now(),
  };

  // works for keys with no passphrase and keys with passphrase if .env variable matches correctly
  const signedToken = jsonwebtoken.sign(
    payload,
    { key: PRIV_KEY, passphrase: process.env.RSA_PASSPHRASE ?? '' },
    {
      expiresIn: expiresIn,
      algorithm: 'RS256',
    },
  );

  return {
    token: `Bearer ${signedToken}`,
    expires: expiresIn,
  };
}
