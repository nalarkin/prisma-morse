import createError from 'http-errors';
import * as registerService from './registerService';
import { ajv, SCHEMA } from '@/common';
import type { RegisterForm } from '@/common';
import type { RequestHandler } from 'express';

function validateRegistrationForm(body: unknown) {
  const validate = ajv.getSchema<RegisterForm>(SCHEMA.REGISTER);
  if (validate === undefined) {
    throw createError(500, 'Unable to get json validator');
  }
  if (!validate(body)) {
    throw createError(400, ajv.errorsText(validate.errors));
  }
  return body;
}

export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    // validate that provided request body matches expected format
    const { password: unsafePassword, email, firstName, lastName } = validateRegistrationForm(req.body);

    // hashed password which is safe to store in database
    const password = await registerService.convertPasswordForStorage(unsafePassword);

    // @TODO: Remove unsafe password before pushing to production
    const newUserToRegister = { password, unsafePassword, email, firstName, lastName };
    return res.json(await registerService.createUser(newUserToRegister));
  } catch (e) {
    next(e);
  }
};
