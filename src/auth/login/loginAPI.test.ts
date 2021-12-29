import faker from 'faker';
import supertest from 'supertest';
import { app } from '../../loaders';
import { prismaMock } from '../../loaders/singleton';
import { makeTestUser } from '../../testing';

describe('Login API', () => {
  describe('POST /api/auth/login/', () => {
    it('When request body is missing email, then the response code is 400', async () => {
      const body = {
        password: faker.internet.password(),
      };

      await supertest(app).post('/api/auth/login/').send(body).expect(400);
    });
    it('When request body is missing password, then the response code is 400', async () => {
      const body = {
        email: faker.internet.email(),
      };

      await supertest(app).post('/api/auth/login/').send(body).expect(400);
    });
    it('When request body is has additional properties in addition to the required, the response code is 200', async () => {
      // overwrite with  password and corresponding hashed password
      const testUser = {
        ...makeTestUser(),
        password: '$argon2id$v=19$m=16384,t=2,p=1$5fpLPab618p0L3qdLQM8jw$SxvQq9qN6bCfFm/v8qAKnAiwy+SP/IbdI3C98x0uprw',
        unsafePassword: 'xUIinkea7MRzlXn',
      };
      const body = {
        email: testUser.email,
        password: 'xUIinkea7MRzlXn',
        message: faker.random.word(),
      };

      prismaMock.user.findUnique.mockResolvedValue(testUser);

      await supertest(app)
        .post('/api/auth/login/')
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
    it('When user attempts login with correct information, the server responds with an access_token and refresh_token', async () => {
      // overwrite with  password and corresponding hashed password
      const testUser = {
        ...makeTestUser(),
        password: '$argon2id$v=19$m=16384,t=2,p=1$5fpLPab618p0L3qdLQM8jw$SxvQq9qN6bCfFm/v8qAKnAiwy+SP/IbdI3C98x0uprw',
        unsafePassword: 'xUIinkea7MRzlXn',
      };
      const body = {
        email: testUser.email,
        password: 'xUIinkea7MRzlXn',
      };

      prismaMock.user.findUnique.mockResolvedValue(testUser);
      await supertest(app)
        .post('/api/auth/login/')
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
