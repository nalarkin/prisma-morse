// /* eslint-disable @typescript-eslint/no-namespace */
// import * as winston from 'winston';

// declare global {
//   type Log = winston.Logger;
//   const log: Log;
//   namespace NodeJS {
//     interface Global {
//       log: Log;
//     }
//   }
// }

// interface CustomNodeJsGlobalLogger extends NodeJS.Global {
//   log: Log;
// }

// declare const global: CustomNodeJsGlobalLogger;

// export const setDefaultLogger = (logger: winston.Logger) => (global.log = logger);
export {};
