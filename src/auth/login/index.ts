import express from 'express';
import { verifyPassword } from '../utils';
import { issueJWT } from '../utils';
import prisma from '../../config/database';
import { ajv } from '../../common/validation';
import { createResponse } from '../../common/response';

const router = express.Router();

interface LoginForm {
  email: string;
  password: string;
}

/** Login user, and respond with JWT if successful. */
router.post('/auth/login', async function (req, res) {
  try {
    const validator = ajv.getSchema<LoginForm>('login');
    if (validator === undefined) {
      return res.status(500).json(createResponse({ error: 'Unable to retrieve validator for login' }));
    }
    if (!validator(req.body)) {
      return res.status(401).json(createResponse({ error: ajv.errorsText(validator.errors) }));
    }
    const { password, email } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user === null) {
      return res.status(401).json(
        createResponse({
          error: 'User does not exist with these credentials',
        }),
      );
    }
    const isAuthenticated = await verifyPassword(user.password, password);
    if (!isAuthenticated) {
      return res.status(401).json(
        createResponse({
          error: 'User does not exist with these credentials',
        }),
      );
    }
    res.json(createResponse({ data: issueJWT(user) }));
  } catch (e) {
    log.error(e);
    res.status(401).json({ error: `Unknown error occured. ${JSON.stringify(e)}` });
  }
});

export default router;
