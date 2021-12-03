import { PrismaClient, Prisma } from '@prisma/client';
import * as faker from 'faker';

const userData: Prisma.UserCreateInput[] = Array.from({ length: 10 }).map(
  () => ({
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    email: faker.internet.email(),
  })
);
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
