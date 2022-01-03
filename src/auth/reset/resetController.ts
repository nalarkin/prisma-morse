import type { RequestHandler } from 'express';
import createError from 'http-errors';
import { ajv, getValidJWTPayload, SCHEMA, getValidated } from '../../common';
import type { PasswordResetForm } from '../../common/schema';
import * as usersService from '../../users/usersService';
import { verifyPassword } from '../utils';
import * as resetService from './resetService';

export const passwordReset: RequestHandler = async (req, res, next) => {
  try {
    // validate that form matches expected properties
    const passwordResetForm = validatePasswordResetForm(req.body);

    // validate that data within JWT follows expected properties
    const { sub: userId } = getValidJWTPayload(req.user);

    // get the latest info on the user who is requesting the password reset
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
  const data = getValidated<PasswordResetForm>(SCHEMA.PASSWORD_RESET, body);
  if (data.newPassword === data.password) {
    throw createError(400, 'New password must be different from current password');
  }
  return data;
}
