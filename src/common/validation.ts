import Ajv from 'ajv';
import { schema_login } from './schema/schema_login';
import { schema_register } from './schema/schema_register';
import { schema_consumable, schema_take_consumable } from './schema/schema_consumable';
import { schema_refresh_token } from './schema/schema_token';
import { schema_user, schema_user_id } from './schema/schema_user';
import addFormats from 'ajv-formats';
// eslint-disable-next-line @typescript-eslint/no-var-requires

/** Validates and type creates type guards. Makes it great to do all
 * validation when first receiving json request */
export const ajv = new Ajv({ $data: true, allErrors: true });

// used to validate emails during registration attempt
addFormats(ajv, ['email', 'date-time']);

ajv.addSchema(schema_login, 'login');
ajv.addSchema(schema_register, 'register');
ajv.addSchema(schema_consumable, 'newConsumable');
ajv.addSchema(schema_take_consumable, 'takeConsumable');
ajv.addSchema(schema_refresh_token, 'refreshToken');
ajv.addSchema(schema_user, 'user');
ajv.addSchema(schema_user_id, 'userId');
