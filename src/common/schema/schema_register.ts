import { JSONSchemaType } from 'ajv';

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

/** @TODO add validation for confirmed passwords
 * @TODO add email verification, see this https://www.npmjs.com/package/ajv-formats
 *
 */
export const schema_register: JSONSchemaType<RegisterForm> = {
  $id: 'register',
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
    confirmPassword: { type: 'string' },
    name: { type: 'string' },
  },
  required: ['email', 'password', 'name', 'confirmPassword'],
  additionalProperties: true,
};
