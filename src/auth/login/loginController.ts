import { ajv, AuthenticationError, BadRequestError, createResponse, InternalError, LoginForm, SCHEMA } from '@/common';
import { RequestHandler } from 'express';
import { ACCESS_JWT_EXPIRE, issueJWT, REFRESH_JWT_EXPIRE } from '@/auth/utils';
import { loginService } from './loginService';

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

const login: RequestHandler = async (req, res, next) => {
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
    // they are authenticated, so give them a JWT for future requests
    const payload = {
      access_token: issueJWT(userResult, ACCESS_JWT_EXPIRE),
      refresh_token: issueJWT(userResult, REFRESH_JWT_EXPIRE),
    };
    res.json(createResponse({ data: payload }));
  } catch (e) {
    next(e);
  }
};

export const loginController = { login };
