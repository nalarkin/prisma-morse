import { Consumable, Serializable, User } from '@prisma/client';
import faker from 'faker';
import cuid from 'cuid';

type DatabaseUser = Omit<User, 'createdAt'> & { createdAt: string };

export function makeTestUser(): [User, DatabaseUser] {
  const pass = faker.internet.password();
  const testUser = {
    role: faker.random.arrayElement(['ADMIN', 'USER']) as User['role'],
    createdAt: faker.date.past(),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: pass,
    unsafePassword: pass,
    id: faker.datatype.number(99999),
  };
  const databaseUser = { ...testUser, createdAt: testUser.createdAt.toISOString() };
  return [testUser, databaseUser];
}

export function makeTestSerializable(userId: number | null = null): Serializable {
  const updatedAt = faker.date.past();
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    serial_number: faker.datatype.uuid(),
    status: 'USABLE',
    type: faker.random.arrayElement(['DEVICE', 'TOOL']),
    brand: faker.company.companyName(),
    createdAt: faker.date.past(faker.datatype.float({ min: 0.01, max: 1.0, precision: 2 }), updatedAt),
    updatedAt,
    id: cuid(),
    guide: faker.internet.url(),
    photo: faker.internet.url(),
    project: null,
    userId,
    version: faker.datatype.number(99999),
  };
}
export function makeTestConsumable(count: number = faker.datatype.number(99999)): Consumable {
  const updatedAt = faker.date.past();
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    type: faker.random.arrayElement(['CONSUMABLE']),
    createdAt: faker.date.past(faker.datatype.float({ min: 0.01, max: 1.0, precision: 2 }), updatedAt),
    updatedAt,
    id: cuid(),
    guide: faker.internet.url(),
    photo: faker.internet.url(),
    count,
  };
}
