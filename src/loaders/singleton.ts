/**
 * This is only used for test cases.
 * It is used to mock the database so we don't perform CRUD operations on the production database.
 */
import { PrismaClient } from '@prisma/client';

import { mockDeep, mockReset } from 'jest-mock-extended';
import type { DeepMockProxy } from 'jest-mock-extended';

import prisma from './database';

jest.mock('./database', () => ({
  __esModule: true,

  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
