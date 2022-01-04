import { JSONSchemaType } from 'ajv';

export type SearchBasic = {
  searchString: string;
};

export const searchBasic: JSONSchemaType<SearchBasic> = {
  type: 'object',
  properties: {
    searchString: { type: 'string' },
  },
  required: ['searchString'],
};
