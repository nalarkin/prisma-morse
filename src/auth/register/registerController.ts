import { ajv, RegisterForm, SCHEMA } from '@/common';
import { RequestHandler } from 'express';
import * as registerService from './registerService';
import createError from 'http-errors';

export const validateRegistrationForm: RequestHandler = async (req, res, next) => {
  try {
    const validate = ajv.getSchema<RegisterForm>(SCHEMA.REGISTER);
    if (validate === undefined) {
      throw createError(500, 'Unable to get json validator');
    }
    if (!validate(req.body)) {
      throw createError(400, ajv.errorsText(validate.errors));
    }
    next();
  } catch (e) {
    next(e);
  }
};
export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const { password: unsafePassword, email, firstName, lastName } = req.body as RegisterForm;
    const password = await registerService.convertPasswordForStorage(unsafePassword);
    const newUserToRegister = { password, unsafePassword, email, firstName, lastName };
    const registeredUser = registerService.createUser(newUserToRegister);
    return res.json(registeredUser);
  } catch (e) {
    next(e);
  }
};
