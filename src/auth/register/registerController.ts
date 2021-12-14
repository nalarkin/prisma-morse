import { ajv, BadRequestError, createResponse, RegisterForm, SCHEMA } from '@/common';
import { RequestHandler } from 'express';
import * as registerService from './registerService';

export const validateRegistrationForm: RequestHandler = async (req, res, next) => {
  try {
    const validate = ajv.getSchema<RegisterForm>(SCHEMA.REGISTER);
    if (validate === undefined) {
      throw new Error('Unable to get json validator');
    }
    if (!validate(req.body)) {
      return res.status(400).json(createResponse({ error: new BadRequestError(ajv.errorsText(validate.errors)) }));
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
    return res.json(createResponse({ data: registeredUser }));
  } catch (e) {
    next(e);
  }
};
