import { Serializable, User } from '@prisma/client';
import { JSONSchemaType } from 'ajv';

type UpdatableValues = Omit<Serializable, 'id' | 'createdAt' | 'updatedAt' | 'version'>;
export type SerializableUpdate = Partial<UpdatableValues>;

export type SerializableJson = Omit<Serializable, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
  renter?: RenterJson;
};

export type RenterJson = Pick<User, 'firstName' | 'lastName' | 'id'> | null;

export const schemaRenter: JSONSchemaType<RenterJson> = {
  type: 'object',
  nullable: true,
  properties: {
    id: { type: 'integer' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
  },
  required: ['id', 'firstName', 'lastName'],
};

export const schema_serializable: JSONSchemaType<SerializableJson> = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
    },
    name: {
      type: 'string',
    },
    serial_number: {
      type: 'string',
    },
    brand: {
      type: 'string',
      nullable: true,
    },
    status: {
      type: 'string',
      enum: ['BROKEN', 'USABLE', 'SCRAP', 'IN_REPAIR'],
    },
    type: {
      type: 'string',
      enum: ['TOOL', 'DEVICE'],
    },
    project: {
      type: 'string',
      nullable: true,
    },
    description: {
      type: 'string',
      nullable: true,
    },
    guide: {
      type: 'string',
      nullable: true,
    },
    userId: {
      type: 'integer',
      nullable: true,
    },
    version: {
      type: 'integer',
    },
    photo: {
      type: 'string',
      nullable: true,
    },
    renter: {
      type: 'object',
      nullable: true,
      properties: {
        id: { type: 'integer' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
      },
      required: ['id', 'firstName', 'lastName'],
    },
  },
  required: [
    'id',
    'type',
    'brand',
    'createdAt',
    'description',
    'guide',
    'name',
    'photo',
    'serial_number',
    'updatedAt',
    'version',
  ],
  additionalProperties: false,
};
// export const serializableUpdateSchema: JSONSchemaType<SerializableJson> = {
//   type: 'object',
//   properties: {
//     id: {
//       type: 'string',
//     },
//     createdAt: {
//       type: 'string',
//       format: 'date-time',
//     },
//     updatedAt: {
//       type: 'string',
//       format: 'date-time',
//     },
//     name: {
//       type: 'string',
//     },
//     serial_number: {
//       type: 'string',
//     },
//     brand: {
//       type: 'string',
//       nullable: true,
//     },
//     status: {
//       type: 'string',
//       enum: ['BROKEN', 'USABLE', 'SCRAP', 'IN_REPAIR'],
//     },
//     type: {
//       type: 'string',
//       enum: ['TOOL', 'DEVICE'],
//     },
//     project: {
//       type: 'string',
//       nullable: true,
//     },
//     description: {
//       type: 'string',
//       nullable: true,
//     },
//     guide: {
//       type: 'string',
//       nullable: true,
//     },
//     userId: {
//       type: 'integer',
//       nullable: true,
//     },
//     version: {
//       type: 'integer',
//     },
//     photo: {
//       type: 'string',
//       nullable: true,
//     },
//   },
//   required: [
//     'id',
//     'type',
//     'brand',
//     'createdAt',
//     'description',
//     'guide',
//     'name',
//     'photo',
//     'serial_number',
//     'updatedAt',
//     'version',
//   ],
//   additionalProperties: false,
// };
// // type SerializableUpdate = Omit<Serializable, 'createdAt' | 'updatedAt'>
// export const schema_serializable_update: JSONSchemaType<SerializableUpdate> = {
//   type: 'object',
//   properties: {
//     name: {
//       type: 'string',
//       nullable: true,
//     },
//     serial_number: {
//       type: 'string',
//       nullable: true,
//     },
//     brand: {
//       type: 'string',
//       nullable: true,
//     },
//     status: {
//       type: 'string',
//       enum: ['BROKEN', 'USABLE', 'SCRAP', 'IN_REPAIR'],
//     },
//     type: {
//       type: 'string',
//       enum: ['TOOL', 'DEVICE', 'CONSUMABLE'],
//     },
//     project: {
//       type: 'string',
//       nullable: true,
//     },
//     description: {
//       type: 'string',
//       nullable: true,
//     },
//     guide: {
//       type: 'string',
//       nullable: true,
//     },
//     userId: {
//       type: 'integer',
//       nullable: true,
//     },
//     photo: {
//       type: 'string',
//       nullable: true,
//     },
//   },
//   minProperties: 1,
//   additionalProperties: false,
// };

// /** Validates number provided is integer and positive number.  */
// export const schema_take_consumable: JSONSchemaType<SerializableUpdate> = {
//   type: 'object',
//   properties: {
//     count: { type: 'integer', minimum: 1 },
//   },
//   required: ['count'],
//   additionalProperties: false,
// };
