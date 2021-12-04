import Ajv from 'ajv';
import { schema_login } from './schema/schema_login';
import { schema_register } from './schema/schema_register';
import { schema_consumable, schema_take_consumable } from './schema/schema_consumable';

/** Validates and type creates type guards. Makes it great to do all
 * validation when first receiving json request */
export const ajv = new Ajv({ $data: true, allErrors: true });

ajv.addSchema(schema_login, 'login');
ajv.addSchema(schema_register, 'register');
ajv.addSchema(schema_consumable, 'newConsumable');
ajv.addSchema(schema_take_consumable, 'takeConsumable');
