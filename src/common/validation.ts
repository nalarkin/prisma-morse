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
import { schema_login } from './schema/schema_login';
import { schema_register } from './schema/schema_register';
import { schema_consumable, schema_take_consumable } from './schema/schema_consumable';
import { schema_refresh_token } from './schema/schema_token';
import { schema_user, schema_user_id } from './schema/schema_user';
import addFormats from 'ajv-formats';
import { schema_item_id } from './schema/schema_cuid';
// eslint-disable-next-line @typescript-eslint/no-var-requires

/**
 * Validates and type creates type guards. Makes it great to do all
 * validation when first receiving json request
 *
 * $data: true - enables the matching confirmation between password and Confirming
 * password during user registration.
 * allErrors: true - provides more detailed errors for validation issues to the front end,
 * will display all errors that exist instead of only returning first error (the default behavior).
 *
 */
export const ajv = new Ajv({ $data: true, allErrors: true });

// used to validate emails during registration attempt
addFormats(ajv, ['email', 'date-time', 'date']);

const LOGIN = 'login';
const REGISTER = 'register';
const CONSUMABLE_NEW = 'newConsumable';
const CONSUMABLE_TAKE = 'takeConsumable';
const TOKEN_REFRESH = 'refreshToken';
const USER_EDIT = 'userEdit';
const USER_ID = 'userId';
const CUID = 'itemId';

// Add all the schema to this single instance. It will get cached so repeated scheam validations are very quick.
ajv.addSchema(schema_login, LOGIN);
ajv.addSchema(schema_register, REGISTER);
ajv.addSchema(schema_consumable, CONSUMABLE_NEW);
ajv.addSchema(schema_take_consumable, CONSUMABLE_TAKE);
ajv.addSchema(schema_refresh_token, TOKEN_REFRESH);
ajv.addSchema(schema_user, USER_EDIT);
ajv.addSchema(schema_user_id, USER_ID);
ajv.addSchema(schema_item_id, CUID);

/** Exported constants to make access to schema reliable and supportive of autocomplete */
export const SCHEMA = { LOGIN, REGISTER, CONSUMABLE_NEW, CONSUMABLE_TAKE, TOKEN_REFRESH, USER_EDIT, USER_ID, CUID };
