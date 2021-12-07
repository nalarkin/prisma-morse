import express from 'express';
import { hashPassword } from '../utils';
import prisma from '../../config/database';
import { ajv } from '../../common/validation';
import { RegisterForm } from '../../common/schema/schema_register';
import { createResponse } from '../../common/response';

const router = express.Router();

/** Register a new user */
router.post('/auth/register/', async function (req, res, next) {
  const validate = ajv.getSchema<RegisterForm>('register');
  try {
    if (validate !== undefined && !validate(req.body)) {
      return res.status(401).json(createResponse({ error: ajv.errorsText(validate.errors) }));
    } else {
      const { password, email, firstName, lastName } = req.body;
      const hashedPassword = await hashPassword(password);
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          unsafePassword: password,
          password: hashedPassword,
        },
      });
      res.json(createResponse({ data: user }));
    }
  } catch (e) {
    next(e);
    // next(e);
  }
});

export default router;
