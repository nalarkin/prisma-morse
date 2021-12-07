import dotenv from 'dotenv';
import express from 'express';
import users from './users/index';
import serializables from './serializables/index';
import consumables from './consumables/index';
import transactions from './transactions/index';
import login from './auth/login/index';
import register from './auth/register/index';
import tokenRefresh from './auth/token/refresh';
import protectedRoute from './auth/protected/index';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import pinohttp from 'pino-http';
import passport from 'passport';
import configPassport from './config/passport';
import initializeLogger from './config/logging';

/** Make sure environment variables are loaded */
dotenv.config();

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
app.use('', register);
app.use('', protectedRoute);
app.use('', transactions);
app.use('', tokenRefresh);

/** Start listening on port */
app.listen(8000, () =>
  log.info(`
    Server ready at: http://localhost:8000 
    Users: http://localhost:8000/users
    Serializables: http://localhost:8000/serializables
    Consumables: http://localhost:8000/consumables
    `),
);
