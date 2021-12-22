import { app } from '@/loaders';
import supertest from 'supertest';
import { prismaMock } from '@/loaders/singleton';
import { makeTestUser } from '@/testing';
import faker from 'faker';

describe('Login API', () => {
  describe('POST /auth/login/', () => {
    it('When request body is missing email, then the response code is 400', async () => {
      const body = {
        password: faker.internet.password(),
      };

      await supertest(app).post('/auth/login/').send(body).expect(400);
    });
    it('When request body is missing password, then the response code is 400', async () => {
      const body = {
        email: faker.internet.email(),
      };

      await supertest(app).post('/auth/login/').send(body).expect(400);
    });
    it('When request body is has additional properties, then the response code is 400', async () => {
      const body = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        message: faker.random.word(),
      };

      await supertest(app).post('/auth/login/').send(body).expect(400);
    });
    it('When user attempts login with correct information, the server responds with an access_token and refresh_token', async () => {
      const user = makeTestUser();
      // overwrite with  password and corresponding hashed password
      const testUser = {
        ...user,
        password: '$argon2id$v=19$m=16384,t=2,p=1$5fpLPab618p0L3qdLQM8jw$SxvQq9qN6bCfFm/v8qAKnAiwy+SP/IbdI3C98x0uprw',
        unsafePassword: 'xUIinkea7MRzlXn',
      };
      const body = {
        email: testUser.email,
        password: 'xUIinkea7MRzlXn',
      };

      prismaMock.user.findUnique.mockResolvedValue(testUser);
      await supertest(app)
        .post('/auth/login/')
        .send(body)
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeTruthy();
          expect(body && typeof body === 'object').toBe(true);
          expect(!Array.isArray(body)).toBeTruthy();
          expect(body).toHaveProperty('access_token');
          expect(body).toHaveProperty('refresh_token');
        });
    });
  });
});
