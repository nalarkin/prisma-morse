// import prisma from '@/loaders/database';

// export async function getRefreshToken(token: string) {
//   return prisma.refreshToken.findUnique({
//     where: {
//       id: token,
//     },
//   });
// }

// export async function createRefreshToken(token: string, userId: number) {
//   return prisma.refreshToken.create({ data: { token, userId } });
// }

// /** How does this handle cascading delete? Does it delete user too? */
// export async function deleteRefreshToken(id: string) {
//   return prisma.refreshToken.delete({ where: { id } });
// }
export {};
