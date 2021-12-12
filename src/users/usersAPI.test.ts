import { app } from '@/loaders';
import supertest from 'supertest';
import { User } from '@prisma/client';
import { prismaMock } from '@/loaders/singleton';

describe('Users API', () => {
  describe('GET /users/', () => {
    it('When all are requested, the response is an array of users', async () => {
      // const post = await Post.create({ title: 'Post 1', content: 'Lorem ipsum' });
      // type Tester = Omit<User, 'createdAt'>;
      const testUser: User = {
        createdAt: new Date(),
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password',
        unsafePassword: 'password',
        id: 123,
        role: 'USER',
      };
      // date gets converted to string in SQL storage
      const expected = { ...testUser, createdAt: testUser.createdAt.toISOString() };

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
    it('When an existing user is requsted, the server responds with the user', async () => {
      const testUser: User = {
        createdAt: new Date(),
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password',
        unsafePassword: 'password',
        id: 123,
        role: 'USER',
      };
      // date gets converted to string in SQL storage
      const expected = { ...testUser, createdAt: testUser.createdAt.toISOString() };

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
    it('When an user that does not exist is requsted, the response code is 404', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await supertest(app).get(`/users/83280329039/`).expect(404);
    });
    it('When an id that is a floating point is requsted, the response code is 400', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await supertest(app).get(`/users/832803.29039/`).expect(400);
    });
    it('When an id that is a negative integer is requsted, the response code is 400', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await supertest(app).get(`/users/-9039/`).expect(400);
    });
    it('When an id that contains letters is requested, the response code is 400', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await supertest(app).get(`/users/83n9039/`).expect(400);
    });
  });
});
