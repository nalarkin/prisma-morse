/**
 * The express application uses AJV to validate JSON data provided by user.
 *
 * User provided JSON data should be validated before the server attempts to perform the request actions
 * the user desires (such as database reads, updates, deletions, creation, login, etc.). If we always validate
 * the data at the API entry points, then we can assume that all code outside the initial route handlers will be
 * working with data that matches the JSON schema we define within this file. The goal is for this is to simplify
 * the debugging process and make the application more reliable.
 *
 * AJV was selected as the validation library because it is very performant, popular with large scale companies,
 * provides typescript predicate type guards, and follows a very simple usage pattern.
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import createError from 'http-errors';
import {
  schema_consumable,
  schema_consumable_update,
  schema_item_id,
  schema_jwt,
  schema_login,
  schema_password_reset,
  schema_refresh_token,
  schema_register,
  schema_serializable,
  schema_serializable_new,
  schema_take_consumable,
  schema_user,
  schema_user_id,
} from './schema';
import type { JWTPayloadRequest } from './schema/';
/**
 * Validates and type creates type guards. Makes it great to do all
 * validation when first receiving json request
 *
 * Additional Options Purpose/Reasoning:
 *
 * $data: true - enables the matching confirmation between password and Confirming
 * password during user registration.
 *
 * allErrors: true - provides more detailed errors for validation issues to the front end,
 * will display all errors that exist instead of only returning first error (the default behavior).
 *
 * @example
 * type CustomSchemaType = {
 *  name: string;
 *  age: number;
 * }
 * const unknownData = {name: 'John', age: 29};
 * const validator = ajv.getSchema<CustomSchemaType>('exampleSchemaName');
 * // schema should be added to this file, and then use get schema to retrieve it within the application
 * if (validator === undefined) {
 *    // this occurs when you are not using the same name as when you added the schema to the AJV instance
 *    throw new Error('Could not locate json validator');
 * }
 * if (validator(unknownData)) {
 *  // can safely access the properties
 *  console.log(`Success! Name is ${unknownData.name} and age is ${unknownData.age}`);
 * } else {
 *  console.log('Invalid data');
 * }
 */

// @TODO remove allErrors in production
export const ajv = new Ajv({ $data: true, allErrors: true, removeAdditional: true });
// used to validate email format during user registration
addFormats(ajv, ['email', 'date-time', 'date']);

// the actual strings used for storage is not important, but they need to be unique and you must use the
// same string to retrieve the schema as was used for storage.
const LOGIN = 'login';
const REGISTER = 'register';
const PASSWORD_RESET = 'passwordReset';
const CONSUMABLE_NEW = 'consumableNew';
const CONSUMABLE_TAKE = 'consumableTake';
const CONSUMABLE_UPDATE = 'consumableUpdate';
const SERIALIZABLE_UPDATE = 'serializableUpdate';
const SERIALIZABLE_NEW = 'serializableNew';
const TOKEN_REFRESH = 'refreshToken';
const USER_EDIT = 'userEdit';
const USER_ID = 'userId';
const CUID = 'itemId';
const JWT_REQUEST = 'jwtRequest';

// Add all the schema to this single instance. It will get cached so repeated schema validations are very quick.
// If you want to use access schema in application, then you must add it here, then use the `ajv.getSchema()`
// to access it within the app.
ajv.addSchema(schema_login, LOGIN);
ajv.addSchema(schema_register, REGISTER);
ajv.addSchema(schema_consumable, CONSUMABLE_NEW);
ajv.addSchema(schema_take_consumable, CONSUMABLE_TAKE);
ajv.addSchema(schema_refresh_token, TOKEN_REFRESH);
ajv.addSchema(schema_user, USER_EDIT);
ajv.addSchema(schema_user_id, USER_ID);
ajv.addSchema(schema_item_id, CUID);
ajv.addSchema(schema_serializable, SERIALIZABLE_UPDATE);
ajv.addSchema(schema_consumable_update, CONSUMABLE_UPDATE);
ajv.addSchema(schema_password_reset, PASSWORD_RESET);
ajv.addSchema(schema_jwt, JWT_REQUEST);
ajv.addSchema(schema_serializable_new, SERIALIZABLE_NEW);

/** Exported constants improve schema retrieval reliability and provide autocomplete feature */
export const SCHEMA = {
  LOGIN,
  REGISTER,
  CONSUMABLE_NEW,
  CONSUMABLE_TAKE,
  TOKEN_REFRESH,
  USER_EDIT,
  USER_ID,
  CUID,
  SERIALIZABLE_UPDATE,
  CONSUMABLE_UPDATE,
  PASSWORD_RESET,
  JWT_REQUEST,
  SERIALIZABLE_NEW,
};

/**
 * Generic validator getter that is used to retrieve the schema that is used for validation of requests from users.
 *
 * This component simplifies the use and throws a 500 HTTP error if there is no validator foudn that matches
 * the schema name provided. .
 */
export function getValidator<T>(schemaName: string) {
  const validator = ajv.getSchema<T>(schemaName);
  if (validator === undefined) {
    throw createError(500, `Unable to get JSON validator for schema: '${schemaName}'`);
  }
  return validator;
}

/**
 * Generic utility function that retrieves the provided schema validator and then uses
 * the validator to ensure the data matches the expected pattern.
 *
 * Throws {HttpError} if unable to find matching validator or the provided data does not
 * pass validation.
 *
 * @param schemaName The name of the schema name that was used to store the desired ajv schema, found in /src/common/validation.ts
 * @param data The data that will be validated to match the schema
 * @param errorMessage Optional: String that will be displayed if a {HttpError} 400 status is thrown.
 * @returns The data with matching the schema shape, and possibly with the additinoal properties removed depending on the schema declaration if additionalProperties is set to false.
 *
 * @throws {HttpError} 500: No corresponding schema is associated with the provided schemaName
 * @throws {HttpError} 400: Data provided failed validation
 */
export function getValidated<T>(schemaName: string, data: unknown, errorMessage?: string) {
  const validator = getValidator<T>(schemaName);
  if (validator(data)) {
    return data;
  }
  throw createError(400, errorMessage ?? ajv.errorsText(validator.errors));
}

export function getValidJWTPayload(payload: unknown) {
  return getValidated<JWTPayloadRequest>(JWT_REQUEST, payload, 'JWT Payload has invalid format, please login in again');
}

// export const ajv = new Ajv({ strictTypes: false, $data: true });
// eslint-disable-next-line @typescript-eslint/no-var-requires
// export const isSchemaSecure = ajv.compile(require('ajv/lib/refs/json-schema-secure.json'));

// export const schemaSecurity = {
//   LOGIN: isSchemaSecure(LOGIN),
//   REGISTER: isSchemaSecure(REGISTER),
//   CONSUMABLE_NEW: isSchemaSecure(CONSUMABLE_NEW),
//   CONSUMABLE_TAKE: isSchemaSecure(CONSUMABLE_TAKE),
//   TOKEN_REFRESH: isSchemaSecure(TOKEN_REFRESH),
//   USER_EDIT: isSchemaSecure(USER_EDIT),
//   CUID: isSchemaSecure(CUID),
//   SERIALIZABLE_UPDATE: isSchemaSecure(SERIALIZABLE_UPDATE),
//   CONSUMABLE_UPDATE: isSchemaSecure(CONSUMABLE_UPDATE),
//   PASSWORD_RESET: isSchemaSecure(PASSWORD_RESET),
//   JWT_REQUEST: isSchemaSecure(JWT_REQUEST),
// };
