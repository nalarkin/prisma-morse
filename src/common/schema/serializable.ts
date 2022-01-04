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

export const renter: JSONSchemaType<RenterJson> = {
  type: 'object',
  nullable: true,
  properties: {
    id: { type: 'integer' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
  },
  required: ['id', 'firstName', 'lastName'],
};

export const serializable: JSONSchemaType<SerializableJson> = {
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

export type SerializableNew = Pick<Serializable, 'name' | 'serial_number' | 'type' | 'status'> &
  Partial<Pick<Serializable, 'brand' | 'photo' | 'project' | 'guide' | 'description'>>;

export const serializableNew: JSONSchemaType<SerializableNew> = {
  type: 'object',
  properties: {
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
    photo: {
      type: 'string',
      nullable: true,
    },
  },
  required: ['type', 'name', 'serial_number'],
  additionalProperties: false,
};
