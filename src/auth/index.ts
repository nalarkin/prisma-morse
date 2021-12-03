import argon2, { argon2id, Options } from 'argon2';

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
