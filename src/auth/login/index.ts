import express from 'express';
import { verifyPassword } from '../utils';
// import Ajv, { JSONSchemaType } from 'ajv';
import { issueJWT } from '../utils';
import prisma from '../../config/database';
import { ajv } from '../../common/validation';
// import { LoginForm } from '../../common/schema/schema_login';
import { createResponse } from '../../common/response';
// const ajv = new Ajv();

// interface LoginForm {
//   email: string;
//   password: string;
// }

// const schema: JSONSchemaType<LoginForm> = {
//   type: 'object',
//   properties: {
//     email: { type: 'string' },
//     password: { type: 'string' },
//   },
//   required: ['email', 'password'],
//   additionalProperties: true,
// };

/** Validates and type creates type guards. Makes it great to do all validation of
 * JSON data when you first receive it.
 * NPM package: https://www.npmjs.com/package/ajv
 * Docs: https://ajv.js.org/guide/why-ajv.html
 *
 * */
// const validate = ajv.compile(schema);

const router = express.Router();

interface LoginForm {
  email: string;
  password: string;
}

router.post('/auth/login', async function (req, res, next) {
  const validate = ajv.getSchema<LoginForm>('login');

  log.info('Hello :D');
  if (validate !== undefined && !validate(req.body)) {
    res
      .status(401)
      .json(createResponse({ error: 'Missing username and/or password' }));
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
        return res.status(401).json(
          createResponse({
            error: 'User does not exist with these credentials',
          })
        );
        // throw new Error('User does not exist with these credentials');
      }
      const isAuthenticated = await verifyPassword(user.password, password);
      if (!isAuthenticated) {
        return res.status(401).json(
          createResponse({
            error: 'User does not exist with these credentials',
          })
        );
      }
      // res.json(user);
      const response = createResponse({ data: issueJWT(user) });
      res.json(response);
    } catch (e) {
      // console.error(e);
      // next(e);
      log.error(e);
    }
  }
});

export default router;
