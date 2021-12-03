import argon2, { argon2id, Options } from 'argon2';
import jsonwebtoken from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
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

export async function hashPassword(password: string) {
  return await argon2.hash(password, hashOptions);
}

export async function verifyPassword(hashed: string, pw: string) {
  return await argon2.verify(hashed, pw, {
    type: argon2id,
  });
}

/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the MongoDB user ID
 */
export function issueJWT(user: User) {
  const id = user.id;

  const expiresIn = '1d';

  const payload = {
    sub: id,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(
    payload,
    // PRIV_KEY,
    { key: PRIV_KEY, passphrase: process.env.RSA_PASSPHRASE ?? '' },
    {
      expiresIn: expiresIn,
      algorithm: 'RS256',
    }
  );

  return {
    token: 'Bearer ' + signedToken,
    expires: expiresIn,
  };
}
