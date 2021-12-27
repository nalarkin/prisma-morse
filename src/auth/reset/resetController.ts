import createError from 'http-errors';
import * as usersService from '../../users/usersService';
import * as resetService from './resetService';
import { ajv, SCHEMA, getValidJWTPayload } from '../../common';
import { verifyPassword } from '../utils';
import type { RequestHandler } from 'express';
import type { PasswordResetForm } from '../../common/schema';

export const passwordReset: RequestHandler = async (req, res, next) => {
  try {
    // validate that form matches expected properties
    const passwordResetForm = validatePasswordResetForm(req.body);

    // validate that data within JWT follows expected properties
    const { sub: userId } = getValidJWTPayload(req.user);

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
