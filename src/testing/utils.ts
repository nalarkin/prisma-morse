/**
 * Module contains various helper methods for generating test data.
 *
 * Important Note: If comparing the generated data to a response,
 * apply `JSON.parse(JSON.stringify(responseData))` Otherwise, certain
 * types (like Date) don't will cause a failed test case despite matching stringified data..
 */
import { Consumable, Serializable, User } from '@prisma/client';
import faker from 'faker';
import cuid from 'cuid';

/** Make a user with randomized data */
export function makeTestUser(): User {
  const pass = faker.internet.password();
  return {
    role: faker.random.arrayElement(['ADMIN', 'USER']) as User['role'],
    createdAt: faker.date.past(),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: pass,
    unsafePassword: pass,
    id: faker.datatype.number(99999),
  };
}

/** Make a serializable with randomized data, and with optional userId of renter */
export function makeTestSerializable(userId: number | null = null): Serializable {
  const updatedAt = faker.date.past();
  return {
    updatedAt,
    userId,
    id: cuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    serial_number: faker.datatype.uuid(),
    status: 'USABLE',
    type: faker.random.arrayElement(['DEVICE', 'TOOL']),
    brand: faker.company.companyName(),
    createdAt: faker.date.past(faker.datatype.float({ min: 0.01, max: 1.0, precision: 0.01 }), updatedAt),
    guide: faker.internet.url(),
    photo: faker.internet.url(),
    project: null,
    version: faker.datatype.number(99999),
  };
}
export function makeTestConsumable(count: number = faker.datatype.number(99999)): Consumable {
  const updatedAt = faker.date.past();
  return {
    count,
    updatedAt,
    id: cuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    type: faker.random.arrayElement(['CONSUMABLE']),
    createdAt: faker.date.past(faker.datatype.float({ min: 0.01, max: 1.0, precision: 2 }), updatedAt),
    guide: faker.internet.url(),
    photo: faker.internet.url(),
  };
}
