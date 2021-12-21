/**
 * All files that connect to prisma should import the client instance from this file.
 * makes it so hot reloads does not create hundreds of connections
 * To learn more see: https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
 */

/* eslint-disable @typescript-eslint/no-namespace */
import { PrismaClient } from '@prisma/client';

declare global {
  namespace NodeJS {
    interface Global {
      prisma?: PrismaClient;
    }
  }
}

interface CustomNodeJsGlobal extends NodeJS.Global {
  prisma: PrismaClient;
}

declare const global: CustomNodeJsGlobal;

const prisma: PrismaClient = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;
