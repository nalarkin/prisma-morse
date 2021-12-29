import prisma from '../../loaders/database';

export async function passwordUpdate(id: number, password: string) {
  return prisma.user.update({ where: { id }, data: { password } });
}

export async function passwordUpdateUnsafe(id: number, unsafePassword: string) {
  return prisma.user.update({ where: { id }, data: { unsafePassword } });
}
