/* eslint-disable import/no-named-as-default-member */
/**
 * Applies all middleware to the express application.
 *
 * This includes adding authentication (which uses the passport library) and route handlers.
 */
import express from 'express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import pinohttp from 'pino-http';
import passport from 'passport';
import { config } from 'dotenv';
import configPassport from './passport';
import { loadRoutes } from './routes';
import cookieParser from 'cookie-parser';

config(); // Make sure environment variables are loaded

/** Add all the middleware to the provided express app. */
export function loadExpress({ app }: { app: express.Application }) {
  app.use(express.json());

  app.use(cookieParser()); // used for JWT refresh tokens

  configPassport(passport); // add passport JWT authentication middleware
  app.use(passport.initialize()); // add the configured passport to express app

  // app.use( pinohttp()); /** Uncomment to get detailed HTML logs, recommend command `yarn pino` to improve visual output */

  app.use('/api', loadRoutes()); // apply all route handlers to the express app
}
