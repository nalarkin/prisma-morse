import express from 'express';
import { hashPassword } from '@/auth/utils';
import prisma from '@/loaders/database';
import { ajv, SCHEMA, createResponse, RegisterForm } from '@/common';

const router = express.Router();

/** Register a new user */
router.post('/', async function (req, res, next) {
  try {
    const validate = ajv.getSchema<RegisterForm>(SCHEMA.REGISTER);
    if (validate === undefined) {
      return res.status(500).json(createResponse({ error: 'Unable to get json validator', status: 500 }));
    }
    if (!validate(req.body)) {
      return res.status(401).json(createResponse({ error: ajv.errorsText(validate.errors), status: 401 }));
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
  }
});
/** Register a new user */
router.post('/email/', async function (req, res, next) {
  try {
    const validate = ajv.getSchema<RegisterForm>(SCHEMA.REGISTER);
    if (validate === undefined) {
      return res.status(500).json(createResponse({ error: 'Unable to get json validator', status: 500 }));
    }
    if (!validate(req.body)) {
      return res.status(401).json(createResponse({ error: ajv.errorsText(validate.errors), status: 401 }));
    } else {
      // const { password, email, firstName, lastName } = req.body;
      // const hashedPassword = await hashPassword(password);
      // const user = await prisma.user.create({
      //   data: {
      //     firstName,
      //     lastName,
      //     email,
      //     unsafePassword: password,
      //     password: hashedPassword,
      //   },
      // });
      res.json(createResponse({ data: { message: 'it was validated!' } }));
    }
  } catch (e) {
    next(e);
  }
});

export default router;
