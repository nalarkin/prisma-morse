import { ajv, SCHEMA } from '@/common';
import { RequestHandler } from 'express';
import { PasswordResetForm } from '@/common/schema';
import createError from 'http-errors';
import { verifyPassword } from '../utils';
import * as usersService from '@/users/usersService';
import * as resetService from './resetService';
import { validateJWTFormat } from '../../common/validation';

export const passwordReset: RequestHandler = async (req, res, next) => {
  try {
    const passwordResetForm = validatePasswordResetForm(req.body);

    const { sub: userId } = validateJWTFormat(req.user);
    // const { sub: userId } = req.user as JWTData;
    const user = await usersService.getUser(userId);

    const matchesCurrentPassword = await verifyPassword(user.password, passwordResetForm.password);
    if (!matchesCurrentPassword) {
      throw createError(401, 'Invalid Account Credentials');
    }
    return res.json(await resetService.updatePassword(user.id, passwordResetForm.newPassword));
  } catch (e) {
    next(e);
  }
};

function validatePasswordResetForm(body: unknown) {
  const validator = ajv.getSchema<PasswordResetForm>(SCHEMA.PASSWORD_RESET);
  if (validator === undefined) {
    throw createError(500, 'Could not locate JSON validator');
  }
  if (!validator(body)) {
    throw createError(400, ajv.errorsText(validator.errors));
  }
  if (body.newPassword === body.password) {
    throw createError(400, 'New password must be different from current password');
  }
  return body;
}
