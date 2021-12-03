import express from 'express';
import { hashPassword, verifyPassword } from '../utils';
import { logger, prisma } from '../../app';
import Ajv, { JSONSchemaType } from 'ajv';
const ajv = new Ajv();

interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

/** @TODO add validation for confirmed passwords
 * @TODO add email verification, see this https://www.npmjs.com/package/ajv-formats
 *
 */
const schema: JSONSchemaType<RegisterForm> = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
    confirmPassword: { type: 'string' },
    name: { type: 'string' },
  },
  required: ['email', 'password', 'password', 'confirmPassword'],
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
// const prisma = new PrismaClient();

router.post('/auth/register', async function (req, res, next) {
  if (!validate(req.body)) {
    res
      .status(401)
      .json({ message: 'Missing username a field or passwords do not match' });
  } else {
    try {
      const { password, email, name, confirmPassword } = req.body;
      const hashedPassword = await hashPassword(password);
      const user = await prisma.user.create({
        data: {
          name: name,
          email: email,
          unsafePassword: password,
          password: hashedPassword,
        },
      });
      res.json(user);
    } catch (e) {
      // console.error(e);
      next(e);
    }
  }
});

export default router;
