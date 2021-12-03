import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyPassword } from '..';
import { logger } from '../../index';
import Ajv, { JSONSchemaType } from 'ajv';
const ajv = new Ajv();

interface LoginForm {
  email: string;
  password: string;
}

const schema: JSONSchemaType<LoginForm> = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['email', 'password'],
  additionalProperties: true,
};

/** Validates and type creates type guards. Makes it great to do all validation of
 * JSON data when you first receive it.
 * NPM package: https://www.npmjs.com/package/ajv
 * Docs: https://ajv.js.org/guide/why-ajv.html
 *
 * */
const validate = ajv.compile(schema);

const router = express.Router();
const prisma = new PrismaClient();

router.post('/auth/login', async (req, res, next) => {
  // const consumables = await prisma.consumable.findMany();
  // const consumables = await prisma.consumable.findMany();
  // req.log.info('hello');
  if (!validate(req.body)) {
    res.status(401).json({ message: 'Missing username and/or password' });
  } else {
    try {
      const { password, email } = req.body;
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      // console.log(user);
      if (user === null) {
        res
          .status(401)
          .json({ message: 'User does not exist with these credentials' });
        throw new Error('User does not exist with these credentials');
      }
      const isAuthenticated = await verifyPassword(user.password, password);
      if (!isAuthenticated) {
        res
          .status(401)
          .json({ message: 'User does not exist with these credentials' });
      }
      res.json(user);
    } catch (e) {
      console.error(e);
    }
  }
});

export default router;
