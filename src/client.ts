import { PrismaClient } from '@prisma/client';
// import nodejs from '';

// add prisma to the NodeJS global type

// declare global {
//   prisma: PrismaClient; // <-- Same type as below
//   namespace NodeJS {
//     interface Global {
//       prisma: PrismaClient;
//     }
//   }
// }

declare global {
  namespace NodeJS {
    interface Global {
      prisma?: PrismaClient;
    }
  }
}

// declare global {
//   interface GlobalPrisma extends PrismaClient {
//     prisma: PrismaClient;
//   }
// }

interface CustomNodeJsGlobal extends NodeJS.Global {
  prisma: PrismaClient;
}

// Prevent multiple instances of Prisma Client in development

declare const global: CustomNodeJsGlobal;

const prisma: PrismaClient = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;
