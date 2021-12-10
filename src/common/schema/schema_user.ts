import { JSONSchemaType } from 'ajv';
import { User } from '@prisma/client';

export type UserEdit = Omit<User, 'createdAt' | 'id'>;

export const schema_user: JSONSchemaType<UserEdit> = {
  $id: '/schemas/user',
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
    },
    unsafePassword: {
      type: 'string',
    },
    firstName: {
      type: ['string'],
    },
    lastName: {
      type: ['string'],
    },
    role: {
      type: 'string',
      enum: ['USER', 'ADMIN'],
    },
  },
  required: [],
  additionalProperties: false,
};

export const schema_user_id: JSONSchemaType<number> = {
  type: 'integer',
  minimum: 0,
};
