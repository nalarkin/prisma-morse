/* eslint-disable @typescript-eslint/no-namespace */
import faker from 'faker';
import supertest from 'supertest';
import { app } from '../loaders';
import { prismaMock } from '../loaders/singleton';
import { makeTestUser } from '../testing';

describe('Users API', () => {
  describe('GET /api/users/', () => {
    it('When all users are requested, the response is an array of users', async () => {
      const testUser = makeTestUser();

      prismaMock.user.findMany.mockResolvedValue([testUser]);
      await supertest(app)
        .get('/api/users/')
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body)).toBeTruthy();
          expect(body.length).toBe(1);
          const user = body[0];
          expect(user).toStrictEqual(JSON.parse(JSON.stringify(testUser)));
        });
    });
  });
  describe('GET /api/users/:id/', () => {
    it('When an existing user is requested, the server responds with the user', async () => {
      const testUser = makeTestUser();
      prismaMock.user.findUnique.mockResolvedValue(testUser);
      await supertest(app)
        .get(`/api/users/${testUser.id}/`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeTruthy();
          // ensure that it is a user object before accessing properties
          expect(body && typeof body === 'object').toBe(true);
          expect(!Array.isArray(body)).toBeTruthy();
          expect(body).toStrictEqual(JSON.parse(JSON.stringify(testUser)));
        });
    });
    it('When an user that does not exist is requested, the response code is 404', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await supertest(app)
        .get(`/api/users/${faker.datatype.number(9999999)}/`)
        .expect(404);
    });
    it('When an id that is a floating point is requested, the response code is 400', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      // @TODO: Add more robust randomization of float numbers
      const positiveFloat = faker.datatype.float({ min: 0, precision: 0.001, max: 9999999 });
      const negativeFloat = faker.datatype.float({ max: -1, precision: 0.001, min: -9999999 });
      await supertest(app).get(`/api/users/${positiveFloat}/`).expect(400);
      await supertest(app).get(`/api/users/${negativeFloat}/`).expect(400);
    });
    it('When an id that is a negative integer is requested, the response code is 400', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await supertest(app)
        .get(`/api/users/${faker.datatype.number({ max: -1, min: -999999 })}/`)
        .expect(400);
    });
    it('When an id that contains letters is requested, the response code is 400', async () => {
      const letterAtEnd = faker.datatype.number({ min: 0 }) + faker.random.alpha({ count: 1 });
      const letterInMiddle =
        faker.datatype.number({ min: 0 }) + faker.random.alpha({ count: 1 }) + faker.datatype.number({ min: 0 });
      const letterAtBeginning = faker.random.alpha({ count: 1 }) + faker.datatype.number({ min: 0 });
      await supertest(app).get(`/api/users/${letterAtEnd}/`).expect(400);
      await supertest(app).get(`/api/users/${letterAtBeginning}/`).expect(400);
      await supertest(app).get(`/api/users/${letterInMiddle}/`).expect(400);
    });
  });
});
