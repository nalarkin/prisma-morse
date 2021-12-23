import { User } from '@prisma/client';
import { JSONSchemaType } from 'ajv';

export type JWTPayloadRequest = {
  sub: User['id'];
  role: User['role'];
  iat: number;
  exp: number;
};

export const schema_jwt: JSONSchemaType<JWTPayloadRequest> = {
  type: 'object',
  properties: {
    sub: { type: 'integer', minimum: 0 },
    role: { type: 'string', enum: ['ADMIN', 'USER'] },
    exp: { type: 'integer' },
    iat: { type: 'integer' },
  },
  required: ['sub', 'role', 'iat', 'exp'],
  additionalProperties: false,
};
