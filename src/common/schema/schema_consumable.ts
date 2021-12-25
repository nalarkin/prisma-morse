import { Consumable } from '@prisma/client';
import { JSONSchemaType } from 'ajv';

type UpdatableValues = Omit<Consumable, 'createdAt' | 'updatedAt' | 'id'>;
export type ConsumableUpdate = Partial<UpdatableValues>;
export type ConsumableJson = Omit<Consumable, 'createdAt' | 'updatedAt'> & { createdAt?: string; updatedAt?: string };

export type NewConsumable = Omit<Consumable, 'createdAt' | 'userId' | 'updatedAt' | 'id' | 'type'>;
export type TakeConsumable = Pick<Consumable, 'count'>;

export const schema_consumable: JSONSchemaType<NewConsumable> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    count: { type: 'integer' },
    description: { type: 'string' },
    guide: { type: 'string' },
    photo: { type: 'string' },
  },
  required: ['name', 'count'],
  additionalProperties: false,
};

export const schema_consumable_update: JSONSchemaType<ConsumableJson> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    count: { type: 'integer', minimum: 0 },
    description: { type: 'string', nullable: true },
    guide: { type: 'string', nullable: true },
    photo: { type: 'string', nullable: true },
    createdAt: { type: 'string', format: 'date-time', nullable: true },
    updatedAt: { type: 'string', format: 'date-time', nullable: true },
    id: { type: 'string' },
    type: {
      type: 'string',
      enum: ['CONSUMABLE', 'DEVICE', 'TOOL'],
    },
  },
  required: ['name', 'count', 'description', 'guide', 'type', 'id', 'photo'],
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
