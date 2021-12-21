/**
 * Applies all middleware to the express application.
 */
import express from 'express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import pinohttp from 'pino-http';
import passport from 'passport';
import { config } from 'dotenv';
import configPassport from '@/loaders/passport';

import { loadRoutes } from './routes';

/** Make sure environment variables are loaded */
config();

/** Add all the middleware to the provided express app. */
export function loadExpress({ app }: { app: express.Application }) {
  // eslint-disable-next-line import/no-named-as-default-member
  app.use(express.json());

  // add passport JWT authentication middleware
  configPassport(passport);
  app.use(passport.initialize());

  // app.use( pinohttp()); /** Uncomment to get detailed HTML logs, recommend `yarn pino` to improve visual output */

  // apply all route handlers to the express app
  app.use(loadRoutes());
}
