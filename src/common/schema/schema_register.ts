import { JSONSchemaType } from 'ajv';

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

/**
 * Includes confirmed_password matching using the $data directive
 * https://ajv.js.org/guide/combining-schemas.html#data-reference *
 */
//@ts-expect-error $data directive doesn't agree with type inference of TS
export const schema_register: JSONSchemaType<RegisterForm> = {
  $id: '/schemas/register',
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
    confirmPassword: { type: 'string', pattern: { $data: '1/password' } },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
  },
  required: ['email', 'password', 'firstName', 'lastName', 'confirmPassword'],
  additionalProperties: false,
};
