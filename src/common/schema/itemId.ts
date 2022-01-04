import { JSONSchemaType } from 'ajv';

/** See https://github.com/ericelliott/cuid#broken-down for spec of format */
export const itemId: JSONSchemaType<string> = {
  type: 'string',
  // prettier-ignore
  pattern: 'c[a-zA-Z\\d]{8}[\\d]{4}[a-zA-Z\\d]{12}',
};
