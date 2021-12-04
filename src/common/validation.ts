import Ajv from 'ajv';
import { schema_login } from './schema/schema_login';
import { schema_register } from './schema/schema_register';
import { schema_consumable } from './schema/schema_consumable';
// const schema_login = require('./schema/schema_login.json');
export const ajv = new Ajv();

ajv.addSchema(schema_login, 'login');
// console.log(ajv.schemas);
ajv.addSchema(schema_register, 'register');
ajv.addSchema(schema_consumable, 'newConsumable');

// export const validate_login_json = ajv.compile<LoginForm>(schema_login);
