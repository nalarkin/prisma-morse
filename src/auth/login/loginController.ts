import { ajv, LoginForm, SCHEMA } from '@/common';
import { RequestHandler } from 'express';
import { ACCESS_JWT_EXPIRE, issueJWT, REFRESH_JWT_EXPIRE } from '@/auth/utils';
import * as loginService from './loginService';
import dayjs from 'dayjs';
import createError from 'http-errors';

export const validateLoginForm: RequestHandler = async (req, res, next) => {
  try {
    const validator = ajv.getSchema<LoginForm>(SCHEMA.LOGIN);
    if (validator === undefined) {
      throw createError(500, 'Unable to retrieve validator for login');
    }
    if (!validator(req.body)) {
      throw createError(400, ajv.errorsText(validator.errors));
    }
    next();
  } catch (e) {
    next(e);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { password, email } = req.body as LoginForm; // must be validated because previous middleware
    // search for user in database
    const userResult = await loginService.getSingleUser(email);
    // verify password matches hashed password
    const isAuthenticated = await loginService.verifyProvidedPassword(userResult.password, password);
    if (!isAuthenticated) {
      return next(createError(401, 'User does not exist with these credentials'));
    }
    res.setHeader('Cache-Control', 'no-store'); // recommended by spec here: https://bit.ly/3srGCkw
    res.setHeader('Pragma', 'no-cache'); // recommended by spec here: https://bit.ly/3srGCkw
    // they are authenticated, so give them a JWT for future requests
    const refresh_token = issueJWT(userResult, REFRESH_JWT_EXPIRE);
    const payload = {
      access_token: issueJWT(userResult, ACCESS_JWT_EXPIRE),
      refresh_token,
    };

    // attach refresh_token to cookie
    res.cookie('refresh_token', refresh_token, {
      secure: process.env.NODE_ENV !== 'development',
      httpOnly: true, // prevents improved security against cross site scripting attacks
      expires: dayjs().add(7, 'days').toDate(), // note, this should line up with REFRESH_JWT_EXIPIRE time
      path: '/auth/token/refresh/', // only gets sent on requests to this path
    });
    return res.json(payload);
  } catch (e) {
    next(e);
  }
};
