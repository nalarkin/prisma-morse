import dotenv from 'dotenv';
import express from 'express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import pinohttp from 'pino-http';
import passport from 'passport';
import configPassport from '@/loaders/passport';

import { loadRoutes } from './routes';

/** Make sure environment variables are loaded */
dotenv.config();

/** Add all the middleware to the app. */
export function loadExpress({ app }: { app: express.Application }) {
  configPassport(passport);
  app.use(express.json());
  app.use(passport.initialize());
  // app.use( pinohttp()); /** Uncomment to get detailed HTML logs, recommend `yarn pino` to improve visual output */
  app.use(loadRoutes());
}
