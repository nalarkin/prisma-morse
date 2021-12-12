import { Router } from 'express';
import { ACCESS_JWT_EXPIRE, REFRESH_JWT_EXPIRE, verifyPassword, issueJWT } from '@/auth/utils';
import prisma from '@/loaders/database';
import {
  ajv,
  SCHEMA,
  createResponse,
  InternalError,
  BadRequestError,
  DoesNotExistError,
  AuthenticationError,
} from '@/common';

const router = Router();

interface LoginForm {
  email: string;
  password: string;
}

/** Login user, and respond with JWT if successful. */
router.post('/', async function (req, res, next) {
  try {
    const validator = ajv.getSchema<LoginForm>(SCHEMA.LOGIN);
    if (validator === undefined) {
      return res
        .status(500)
        .json(createResponse({ error: new InternalError('Unable to retrieve validator for login') }));
    }
    if (!validator(req.body)) {
      return res.status(400).json(createResponse({ error: new BadRequestError(ajv.errorsText(validator.errors)) }));
    }
    const { password, email } = req.body;
    // search for user in database
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    // if no user with email provided, don't bother verifying password
    if (user === null) {
      return res.status(401).json(
        createResponse({
          error: new AuthenticationError('No user exists with the email provided. '),
        }),
      );
    }
    // verify password matches hashed password
    const isAuthenticated = await verifyPassword(user.password, password);
    if (!isAuthenticated) {
      return res.status(401).json(
        createResponse({
          error: new AuthenticationError('User does not exist with these credentials'),
        }),
      );
    }
    // they are authenticated, so give them a JWT for future requests
    const payload = {
      access_token: issueJWT(user, ACCESS_JWT_EXPIRE),
      refresh_token: issueJWT(user, REFRESH_JWT_EXPIRE),
    };
    res.json(createResponse({ data: payload }));
  } catch (e) {
    next(e);
  }
});

export default router;
