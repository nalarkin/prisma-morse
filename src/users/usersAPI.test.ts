/* eslint-disable @typescript-eslint/no-namespace */
import { app } from '@/loaders';
import supertest from 'supertest';
// import { User } from '@prisma/client';
import { prismaMock } from '@/loaders/singleton';
import { makeTestUser } from '@/testing';
import faker from 'faker';

expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

describe('Users API', () => {
  describe('GET /users/', () => {
    it('When all users are requested, the response is an array of users', async () => {
      const [testUser, expected] = makeTestUser();

      prismaMock.user.findMany.mockResolvedValue([testUser]);
      await supertest(app)
        .get('/users/')
        .expect(200)
        .then((response) => {
          const { data } = response.body;
          expect(Array.isArray(data)).toBeTruthy();
          expect(data.length).toBe(1);
          const user = data[0];
          expect(user).toStrictEqual(expected);
        });
    });
  });
  describe('GET /users/:id/', () => {
    it('When an existing user is requested, the server responds with the user', async () => {
      const [testUser, expected] = makeTestUser();
      prismaMock.user.findUnique.mockResolvedValue(testUser);
      await supertest(app)
        .get(`/users/${testUser.id}/`)
        .expect(200)
        .then((response) => {
          const { data } = response.body;
          expect(data).toBeTruthy();
          // ensure that it is a user object before accessing properties
          expect(data && typeof data === 'object').toBe(true);
          expect(!Array.isArray(data)).toBeTruthy();
          expect(data).toStrictEqual(expected);
        });
    });
    it('When an user that does not exist is requested, the response code is 404', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await supertest(app)
        .get(`/users/${faker.datatype.number(9999999)}/`)
        .expect(404);
    });
    it('When an id that is a floating point is requested, the response code is 400', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      // @TODO: Add more robust randomization of float numbers
      const positiveFloat = faker.datatype.float({ min: 0, precision: 0.001, max: 9999999 });
      const negativeFloat = faker.datatype.float({ max: -1, precision: 0.001, min: -9999999 });
      await supertest(app).get(`/users/${positiveFloat}/`).expect(400);
      await supertest(app).get(`/users/${negativeFloat}/`).expect(400);
    });
    it('When an id that is a negative integer is requested, the response code is 400', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await supertest(app)
        .get(`/users/${faker.datatype.number({ max: -1, min: -999999 })}/`)
        .expect(400);
    });
    it('When an id that contains letters is requested, the response code is 400', async () => {
      const letterAtEnd = faker.datatype.number({ min: 0 }) + faker.random.alpha({ count: 1 });
      const letterInMiddle =
        faker.datatype.number({ min: 0 }) + faker.random.alpha({ count: 1 }) + faker.datatype.number({ min: 0 });
      const letterAtBeginning = faker.random.alpha({ count: 1 }) + faker.datatype.number({ min: 0 });
      await supertest(app).get(`/users/${letterAtEnd}/`).expect(400);
      await supertest(app).get(`/users/${letterAtBeginning}/`).expect(400);
      await supertest(app).get(`/users/${letterInMiddle}/`).expect(400);
    });
  });
});
