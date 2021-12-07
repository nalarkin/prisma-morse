import { JSONSchemaType } from 'ajv';

export interface RefreshTokenRequest {
  refresh_token: string;
}

/**
 * @TODO add email verification, see this https://www.npmjs.com/package/ajv-formats
 *
 * Includes confirmed_password matching using the $data directive
 * https://ajv.js.org/guide/combining-schemas.html#data-reference *
 */
export const schema_refresh_token: JSONSchemaType<RefreshTokenRequest> = {
  $id: '/schemas/token/refresh',
  type: 'object',
  properties: {
    refresh_token: { type: 'string' },
  },
  required: ['refresh_token'],
  additionalProperties: false,
};
