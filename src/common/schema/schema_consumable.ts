import { Consumable } from '@prisma/client';
import { JSONSchemaType } from 'ajv';

// export type Consumable = {
//   id: string;
//   createdAt: Date;
//   updatedAt: Date;
//   name: string;
//   count: number;
//   type: ItemType;
//   description: string | null;
//   guide: string | null;
//   photo: string | null;
//   userId: number | null;
// };

export type NewConsumable = Omit<Consumable, 'createdAt' | 'userId' | 'updatedAt' | 'id' | 'type'>;

export type TakeConsumable = Pick<Consumable, 'count'>;
/** @TODO add validation for confirmed passwords
 * @TODO add email verification, see this https://www.npmjs.com/package/ajv-formats
 *
 */
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

/** @TODO: Add number validation to ensure positive  */
export const schema_take_consumable: JSONSchemaType<TakeConsumable> = {
  type: 'object',
  properties: {
    count: { type: 'number' },
  },
  required: ['count'],
  additionalProperties: false,
};