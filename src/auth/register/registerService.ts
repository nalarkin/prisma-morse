import { hashPassword } from '../utils';
import * as registerDAL from './registerDAL';

/** Hashes password for safe storage */
export async function convertPasswordForStorage(password: string) {
  return hashPassword(password);
}

export async function createUser(user: registerDAL.NewUser) {
  return registerDAL.createUser(user);
}
