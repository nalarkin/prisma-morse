import express from 'express';
import { ACCESS_JWT_EXPIRE, REFRESH_JWT_EXPIRE, verifyPassword } from '../utils';
import { issueJWT } from '../utils';
import prisma from '../../config/database';
import { ajv } from '../../common/validation';
import { createResponse } from '../../common/response';
import { logger } from '../../config/logging';

const router = express.Router();

interface LoginForm {
  email: string;
  password: string;
}

/** Login user, and respond with JWT if successful. */
router.post('/auth/login/', async function (req, res) {
  try {
    const validator = ajv.getSchema<LoginForm>('login');
    if (validator === undefined) {
      return res.status(500).json(createResponse({ error: 'Unable to retrieve validator for login' }));
    }
    if (!validator(req.body)) {
      return res.status(401).json(createResponse({ error: ajv.errorsText(validator.errors) }));
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
          error: 'User does not exist with these credentials',
        }),
      );
    }
    // verify password matches hashed password
    const isAuthenticated = await verifyPassword(user.password, password);
    if (!isAuthenticated) {
      return res.status(401).json(
        createResponse({
          error: 'User does not exist with these credentials',
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
    logger.error(e);
    res.status(401).json({ error: `Unknown error occured. ${JSON.stringify(e)}` });
  }
});

export default router;
