import { Consumable } from '@prisma/client';
import { JSONSchemaType } from 'ajv';

export type NewConsumable = Omit<Consumable, 'createdAt' | 'userId' | 'updatedAt' | 'id' | 'type'>;

export type TakeConsumable = Pick<Consumable, 'count'>;

export const schema_consumable: JSONSchemaType<NewConsumable> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    count: { type: 'number' },
    description: { type: 'string' },
    guide: { type: 'string' },
    photo: { type: 'string' },
  },
  required: ['name', 'count'],
  additionalProperties: false,
};

/** Validates number provided is integer and positive number.  */
export const schema_take_consumable: JSONSchemaType<TakeConsumable> = {
  type: 'object',
  properties: {
    count: { type: 'integer', minimum: 1 },
  },
  required: ['count'],
  additionalProperties: false,
};
