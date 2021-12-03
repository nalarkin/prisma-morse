import argon2, { argon2id, Options } from 'argon2';
import * as faker from 'faker';
import dotenv from 'dotenv';

const fakePasswords = Array.from({ length: 100 }).map(() =>
  faker.internet.password()
);

/** Recomendations listed here:
 * https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id
 *
 */
const hashOptions: Options & { raw: false } = {
  type: argon2id,
  timeCost: 2,
  memoryCost: 2 ** 14,
  parallelism: 1,
  raw: false,
};

const defaultOption = {
  type: argon2id,
};

export async function hashPassword2(password: string) {
  return await argon2.hash(password, hashOptions);
}

export async function verifyPassword2(hashed: string, pw: string) {
  return await argon2.verify(hashed, pw, {
    type: argon2id,
  });
}

async function main() {
  console.log(`Start auth ...`);
  // const testPassword = 'testPasswordHere';
  // const hasedPassword = await argon2.hash(testPassword, hashOptions);
  // const hashedFail = await argon2.hash('thisshouldfail', {
  //   type: argon2id,
  //   timeCost: 2,
  //   memoryCost: 2 ** 14,
  //   parallelism: 1,
  // });

  // const doesMatch = await argon2.verify(hasedPassword, testPassword, {
  //   type: argon2id,
  // });
  // const doesFail = await argon2.verify(hasedPassword, hashedFail);
  const response = await Promise.all(
    fakePasswords.map(async (pass) => await argon2.hash(pass, defaultOption))
  );
  const verified = await Promise.all(
    response.map(
      async (pass, idx) => await verifyPassword2(pass, `${fakePasswords[idx]}`)
    )
  );
  console.log('Hashed Results ', response);
  // console.log('Hashed verification ', verified);
  // console.log('Does it match? ', doesMatch);
  // console.log('Does it fail? ', doesFail);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // await prisma.$disconnect();
  });
