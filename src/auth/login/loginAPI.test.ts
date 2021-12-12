import { app } from '@/loaders';
import supertest from 'supertest';
import { User } from '@prisma/client';
import { prismaMock } from '@/loaders/singleton';

describe('Login API', () => {
  it('When request body is missing email, then the response code is 400', async () => {
    const body = {
      password: '123456',
    };

    await supertest(app).post('/auth/login/').send(body).expect(400);
  });
  it('When request body is missing password, then the response code is 400', async () => {
    const body = {
      email: 'test@test.com',
    };

    await supertest(app).post('/auth/login/').send(body).expect(400);
  });
  it('When request body is has additional properties, then the response code is 400', async () => {
    const body = {
      email: 'test@test.com',
      password: '123456',
      message: 'hello',
    };

    await supertest(app).post('/auth/login/').send(body).expect(400);
  });
  it('When user attempts login with correct information, the server responds with an access_token and refresh_token', async () => {
    const testUser: User = {
      createdAt: new Date(),
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: '$argon2id$v=19$m=16384,t=2,p=1$5fpLPab618p0L3qdLQM8jw$SxvQq9qN6bCfFm/v8qAKnAiwy+SP/IbdI3C98x0uprw',
      unsafePassword: 'xUIinkea7MRzlXn',
      id: 123,
      role: 'USER',
    };
    const body = {
      email: 'test@test.com',
      password: 'xUIinkea7MRzlXn',
    };

    prismaMock.user.findUnique.mockResolvedValue(testUser);
    await supertest(app)
      .post('/auth/login/')
      .send(body)
      .expect(200)
      .then((response) => {
        const { data } = response.body;
        expect(data).toBeTruthy();
        expect(data && typeof data === 'object').toBe(true);
        expect(!Array.isArray(data)).toBeTruthy();
        expect(data).toHaveProperty('access_token');
        expect(data).toHaveProperty('refresh_token');
      });
  });
});
