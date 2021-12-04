import { JSONSchemaType } from 'ajv';

export interface LoginForm {
  email: string;
  password: string;
}

export const schema_login: JSONSchemaType<LoginForm> = {
  $id: 'login',
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['email', 'password'],
  additionalProperties: true,
};
