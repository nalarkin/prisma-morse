import { PrismaClient, Prisma } from '@prisma/client';
import * as faker from 'faker';
import { hashPassword } from '../src/auth/utils';

async function makeUserData(): Promise<Prisma.UserCreateInput[]> {
  return await Promise.all(
    Array.from({ length: 5 }).map(async () => {
      const unsafePassword = faker.internet.password();
      const password = await hashPassword(unsafePassword);
      return {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: password,
        unsafePassword: unsafePassword,
      };
    })
  );
}

const consumableData: Prisma.ConsumableCreateInput[] = Array.from({
  length: 10,
}).map(() => ({
  name: faker.commerce.product(),
  description: faker.commerce.productDescription(),
  count: faker.datatype.number(1000),
}));
const serializableData: Prisma.SerializableCreateInput[] = Array.from({
  length: 10,
}).map(() => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  serial_number: faker.datatype.uuid(),
  status: 'USABLE',
  type: faker.random.arrayElement(['DEVICE', 'TOOL']),
  brand: faker.company.companyName(),
}));
const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);
  // const userData: Prisma.UserCreateInput[] = await makeUserData();
  // await prisma.user.createMany({ data: userData });
  // await prisma.consumable.createMany({ data: consumableData });
  // await prisma.serializable.createMany({ data: serializableData });
  console.log('Your database has been seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
