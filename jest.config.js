/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  clearMocks: false,
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ["node_modules"],
  // below line allows imports starting with @/* in tests
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [ "**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)" ],
  
  // NOTE: the below line makes all prisma calls get mocked during jest testing, 
  // so you will need to import `prismaMock` from `singleton.ts` and provide 
  // the expected values that would get returned from client. 
  // See /users/usersAPI.test.ts for an example of mocking
  setupFilesAfterEnv: ['<rootDir>/src/loaders/singleton.ts'],
};