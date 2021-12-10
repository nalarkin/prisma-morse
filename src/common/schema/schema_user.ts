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

export type UserId = {
  id: number;
};

export const schema_user_id: JSONSchemaType<UserId> = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      minimum: 0,
    },
  },
  required: ['id'],
  additionalProperties: false,
};
