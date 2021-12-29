import faker from 'faker';
import supertest from 'supertest';
import { RegisterForm } from '../../common';
import { app } from '../../loaders';

describe('Register API', () => {
  describe('POST /api/auth/register/', () => {
    it('When the passwords do not match in the registration form, the response code is 400', async () => {
      const form: RegisterForm = {
        confirmPassword: faker.internet.password(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
      };
      await supertest(app).post('/api/auth/register/').send(form).expect(400);
    });
    it('When the email has an invalid format in the registration form, the response code is 400', async () => {
      const password = faker.internet.password();
      const form: RegisterForm = {
        password,
        confirmPassword: password,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.domainName(),
      };
      await supertest(app).post('/api/auth/register/').send(form).expect(400);
    });
    it('When the registration form is missing an email, the response code is 400', async () => {
      const password = faker.internet.password();

      const form: Omit<RegisterForm, 'email'> = {
        password,
        confirmPassword: password,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };
      await supertest(app).post('/api/auth/register/').send(form).expect(400);
    });
    it('When the registration form is missing a first name, the response code is 400', async () => {
      const password = faker.internet.password();
      const form: Omit<RegisterForm, 'firstName'> = {
        password,
        confirmPassword: password,
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
      };
      await supertest(app).post('/api/auth/register/').send(form).expect(400);
    });
    it('When the registration form is missing a last name, the response code is 400', async () => {
      const password = faker.internet.password();
      const form: Omit<RegisterForm, 'lastName'> = {
        password,
        confirmPassword: password,
        firstName: faker.name.firstName(),
        email: faker.internet.email(),
      };
      await supertest(app).post('/api/auth/register/').send(form).expect(400);
    });
    it('When the registration form has additional properties in addition to the required, the response code is 200', async () => {
      const password = faker.internet.password();

      const form: RegisterForm & { random: string } = {
        password,
        confirmPassword: password,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        random: faker.random.word(),
      };
      await supertest(app).post('/api/auth/register/').send(form).expect(200);
    });
  });
});
