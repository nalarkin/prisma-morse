/* eslint-disable @typescript-eslint/no-namespace */
import { PrismaClient } from '@prisma/client';

declare global {
  namespace NodeJS {
    interface Global {
      prisma?: PrismaClient;
    }
  }
}

// declare global {
//   const prisma: PrismaClient | undefined;
// }

// export const prisma =
//   global.prisma ||
//   new PrismaClient({
//     log: ['query'],
//   });

// if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

interface CustomNodeJsGlobal extends NodeJS.Global {
  prisma: PrismaClient;
}

declare const global: CustomNodeJsGlobal;

const prisma: PrismaClient = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;
