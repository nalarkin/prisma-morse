import dotenv from 'dotenv';
import express from 'express';
import users from './users/index';
import serializables from './serializables/index';
import consumables from './consumables/index';
import login from './auth/login/index';
import protectedRoute from './auth/protected/index';
import pinohttp from 'pino-http';
import pino from 'pino';
import passport from 'passport';
import configPassport from './config/passport';
// import * as winston from 'winston';
// import * as logging from './config/logger';
import initializeLogger from './config/logging';

/** Make sure environment variables are loaded */
dotenv.config();

// export const logger = pino({
//   transport: {
//     target: 'pino-pretty',
//   },
// });

/** Initialize Global Custom Logger */
initializeLogger();

/** Initialize JWT stategy  */
configPassport(passport);

const app = express();
app.use(express.json());
app.use(passport.initialize());
// app.use(pinohttp()); /** Uncomment if you want to see detailed http debug info*/

/** Setup Routes */
app.use('', users);
app.use('', serializables);
app.use('', consumables);
app.use('', login);
app.use('', protectedRoute);

/** Start listening on port */
const server = app.listen(8000, () =>
  log.info(`
    Server ready at: http://localhost:8000 
    Users: http://localhost:8000/users
    Serializables: http://localhost:8000/serializables
    Consumables: http://localhost:8000/consumables
    `)
);
