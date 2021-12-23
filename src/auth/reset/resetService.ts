import { hashPassword } from '@/auth/utils';
import prisma from '@/loaders/database';
import * as resetDAL from './resetDAL';

export async function updatePassword(id: number, password: string) {
  const hashedPassword = await hashPassword(password);
  // const unsafePassword = resetDAL.updateUnsafePassword(id, password);
  // const securePassword = resetDAL.updatePassword(id, hashedPassword);
  const unsafePassword = await resetDAL.passwordUpdateUnsafe(id, password);
  const securePassword = await resetDAL.passwordUpdate(id, hashedPassword);
  return { unsafePassword, securePassword };
}
