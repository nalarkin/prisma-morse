import { JSONSchemaType } from 'ajv';
import { User } from '@prisma/client';

export type UserEdit = Omit<User, 'createdAt' | 'id'>;

export const user: JSONSchemaType<UserEdit> = {
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

export const userId: JSONSchemaType<number> = {
  type: 'integer',
  minimum: 0,
};

export type UserPasswordConfirm = {
  password: string;
};

export const confirmPassword: JSONSchemaType<UserPasswordConfirm> = {
  type: 'object',
  properties: {
    password: {
      type: 'string',
    },
  },
  required: ['password'],
  additionalProperties: false,
};
