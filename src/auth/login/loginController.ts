import type { User } from '@prisma/client';
import dayjs from 'dayjs';
import type { RequestHandler, Response } from 'express';
import createError from 'http-errors';
import { getValidated, LoginForm, SCHEMA } from '../../common';
import * as loginService from './loginService';

/**
 * Handles the login process, including password verification and issuing access and
 * refersh tokens on successful login.
 */
export const login: RequestHandler = async (req, res, next) => {
  try {
    const { password: providedPassword, email } = validateLoginForm(req.body);
    const userInDatabase = await loginService.getLoginInfoFromDatabase(email);

    if (await loginService.isAuthenticated(userInDatabase.password, providedPassword)) {
      return createResponse(res, userInDatabase);
    } else {
      return next(createError(401, 'User does not exist with these credentials'));
    }
  } catch (e) {
    next(e);
  }
};

/** Ensure that provided body meets expected format for login */
export function validateLoginForm(body: unknown) {
  return getValidated<LoginForm>(SCHEMA.LOGIN, body);
}

function createResponse(res: Response, user: Pick<User, 'id' | 'role'>) {
  const responseContent = loginService.createLoginResponseContent(user);
  setResponseHeaders(res);
  attachRefreshTokenCookie(res, responseContent.refresh_token);
  return res.json(responseContent);
}

function setResponseHeaders(res: Response) {
  res.setHeader('Cache-Control', 'no-store'); // recommended by spec here: https://bit.ly/3srGCkw
  res.setHeader('Pragma', 'no-cache'); // recommended by spec here: https://bit.ly/3srGCkw
}

function attachRefreshTokenCookie(res: Response, refresh_token: string) {
  res.cookie('refresh_token', refresh_token, {
    // @TODO: during first deployment, you will need to uncomment the line below, because we wont have https yet
    // secure: process.env.NODE_ENV !== 'development', // if secure it can only be sent over https
    secure: false, // remove this line when after achieving HTTPS in production
    httpOnly: true, // provides improved security against cross site scripting attacks
    expires: dayjs().add(7, 'days').toDate(), // note, this should line up with REFRESH_JWT_EXIPIRE time
    path: '/api/auth/token/refresh/', // only gets sent on requests to this path
  });
}
