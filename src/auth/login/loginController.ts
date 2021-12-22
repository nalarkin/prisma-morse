import { ajv, AuthenticationError, BadRequestError, createResponse, InternalError, LoginForm, SCHEMA } from '@/common';
import { RequestHandler } from 'express';
import { ACCESS_JWT_EXPIRE, issueJWT, REFRESH_JWT_EXPIRE } from '@/auth/utils';
import * as loginService from './loginService';
import dayjs from 'dayjs';

function loginHasExpectedContent(data: unknown) {
  const validator = ajv.getSchema<LoginForm>(SCHEMA.LOGIN);
  if (validator === undefined) {
    return new InternalError('Unable to retrieve validator for login');
  }
  if (!validator(data)) {
    return new BadRequestError(ajv.errorsText(validator.errors));
  }
  return true;
}

export const login: RequestHandler = async (req, res, next) => {
  try {
    const hasExpectedForm = loginHasExpectedContent(req.body);
    if (hasExpectedForm instanceof InternalError || hasExpectedForm instanceof BadRequestError) {
      return res.status(hasExpectedForm.statusCode).json(createResponse({ error: hasExpectedForm }));
    }

    const { password, email } = req.body;
    // search for user in database
    const userResult = await loginService.getSingleUser(email);
    // if no user with email provided, don't bother verifying password
    if (userResult instanceof AuthenticationError) {
      return res.status(userResult.statusCode).json(
        createResponse({
          error: userResult,
        }),
      );
    }
    // verify password matches hashed password
    const isAuthenticated = await loginService.verifyProvidedPassword(userResult.password, password);
    if (!isAuthenticated) {
      return res.status(401).json(
        createResponse({
          error: new AuthenticationError('User does not exist with these credentials'),
        }),
      );
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
    return res.json(createResponse({ data: payload }));
  } catch (e) {
    next(e);
  }
};

// export const loginController = { login };
