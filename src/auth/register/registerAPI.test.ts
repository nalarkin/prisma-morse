import { app } from '@/loaders';
import supertest from 'supertest';
import { RegisterForm } from '@/common';

describe('Register API', () => {
  describe('post /auth/register/', () => {
    it('When the passwords do not match in the registration form, the response code is 400', async () => {
      const form: RegisterForm = {
        confirmPassword: '000000',
        firstName: 'John',
        lastName: 'Doe',
        password: '123456',
        email: 'test@test.com',
      };
      await supertest(app).post('/auth/register/').send(form).expect(400);
    });
    it('When the email has an invalid format in the registration form, the response code is 400', async () => {
      const form: RegisterForm = {
        confirmPassword: '123456',
        firstName: 'John',
        lastName: 'Doe',
        password: '123456',
        email: 'testtest.com',
      };
      await supertest(app).post('/auth/register/').send(form).expect(400);
    });
    it('When the registration form is missing an email, the response code is 400', async () => {
      const form: Omit<RegisterForm, 'email'> = {
        confirmPassword: '123456',
        firstName: 'John',
        lastName: 'Doe',
        password: '123456',
      };
      await supertest(app).post('/auth/register/').send(form).expect(400);
    });
    it('When the registration form is missing a first name, the response code is 400', async () => {
      const form: Omit<RegisterForm, 'firstName'> = {
        confirmPassword: '123456',
        lastName: 'Doe',
        password: '123456',
        email: 'test@test.com',
      };
      await supertest(app).post('/auth/register/').send(form).expect(400);
    });
    it('When the registration form is missing a last name, the response code is 400', async () => {
      const form: Omit<RegisterForm, 'lastName'> = {
        confirmPassword: '123456',
        firstName: 'John',
        password: '123456',
        email: 'test@test.com',
      };
      await supertest(app).post('/auth/register/').send(form).expect(400);
    });
    it('When the registration form has additional properties, the response code is 400', async () => {
      const form: RegisterForm & { random: string } = {
        confirmPassword: '123456',
        firstName: 'John',
        lastName: 'Doe',
        password: '123456',
        email: 'test@test.com',
        random: 'randomAdditionalProperty',
      };
      await supertest(app).post('/auth/register/').send(form).expect(400);
    });
  });
});
