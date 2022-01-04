import type { RequestHandler } from 'express';
import createError from 'http-errors';
import { getValidated, getValidJWTPayload, SCHEMA } from '../../common';
import type { PasswordUpdateForm } from '../../common/schema';
import * as usersService from '../../users/usersService';
import { verifyPassword } from '../utils';
import * as resetService from './updateService';

export const updatePassword: RequestHandler = async (req, res, next) => {
  try {
    // validate that form matches expected properties
    const passwordResetForm = validatePasswordResetForm(req.body);

    // validate that data within JWT follows expected properties
    const { sub: userId } = getValidJWTPayload(req.user);

    // get the latest info on the user who is requesting the password reset
    const user = await usersService.getUser(userId);

    if (await verifyPassword(user.password, passwordResetForm.password)) {
      return res.json(await resetService.updatePassword(user.id, passwordResetForm.newPassword));
    }

    throw createError(401, 'Invalid Account Credentials');
  } catch (e) {
    next(e);
  }
};

function validatePasswordResetForm(body: unknown) {
  const data = getValidated<PasswordUpdateForm>(SCHEMA.PASSWORD_UPDATE, body);
  if (data.newPassword === data.password) {
    throw createError(400, 'New password must be different from current password');
  }
  return data;
}
