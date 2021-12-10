import { app } from '../loaders';
import supertest from 'supertest';
import { User } from '@prisma/client';
import { prismaMock } from '../config/singleton';

test('GET /users/', async () => {
  // const post = await Post.create({ title: 'Post 1', content: 'Lorem ipsum' });
  // type Tester = Omit<User, 'createdAt'>;
  const testUser: User = {
    createdAt: new Date(),
    email: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'password',
    unsafePassword: 'password',
    id: 69,
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
      // Check type and length
      expect(Array.isArray(data)).toBeTruthy();
      expect(data.length).toBe(1);
      // Check data
      const user = data[0];
      expect(user).toStrictEqual(expected);
    });
});
test('GET /users/:id/', async () => {
  const testUser: User = {
    createdAt: new Date(),
    email: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'password',
    unsafePassword: 'password',
    id: 69,
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
      expect(typeof data === 'object');
      expect(!Array.isArray(data)).toBeTruthy();
      expect(data).toStrictEqual(expected);
    });
});
